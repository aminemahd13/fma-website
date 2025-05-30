import ApiMethods from "./ApiMethods";

export const postApplication = (application: any) => {
  const url = 'applications';
  const body = {...application};
  return ApiMethods.post(url, body);
}

export const updateApplicationStatus = (applicationId: number, partialApplicationStatus: any) => {
  const url = `applications/status/${applicationId}`;
  const body = {...partialApplicationStatus};
  return ApiMethods.put(url, body);
}



export const getApplicationById = (id: number) => {
  const url = 'applications';
  return ApiMethods.get(url);
}

export const putApplication = (id: number, partialApplication: any) => {
  const url = `applications/${id}`;
  const body = {...partialApplication};
  return ApiMethods.put(url, body);
}

export const deleteApplication = (id: number) => {
  const url = `applications/${id}`;
  return ApiMethods.delete(url);
}