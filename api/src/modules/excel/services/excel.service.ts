import { BadRequestException, Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp';
import { ConfigService } from '@nestjs/config';
import { columns, rowFactory, styleSheet } from '../config/applications.excel';
import { UserService } from 'src/modules/user/services/user.service';
import { groupBy } from 'src/utils/array';

@Injectable()
export class ExcelService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async downloadApplications() {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet('applications');

    // colums
    sheet.columns = columns;

    // rows
    const users = await this.userService.findAll();
    const usersGroupByTeams = groupBy(
      users,
      (user) => user?.team?.id ?? 'null',
    );
    const rows = rowFactory(
      Object.values(usersGroupByTeams),
      this.configService,
    ).map(Object.values);

    sheet.addRows(rows);

    // style
    styleSheet(sheet);

    const file = await new Promise((resolve) => {
      tmp.file(
        {
          discardDescriptor: true,
          prefix: 'applications',
          postfix: '.xlsx',
          mode: parseInt('0600', 8),
        },
        async (err, file) => {
          if (err) throw new BadRequestException(err);

          workbook.xlsx
            .writeFile(file)
            .then((_) => {
              resolve(file);
            })
            .catch((err) => {
              throw new BadRequestException(err);
            });
        },
      );
    });

    return file;
  }
}
