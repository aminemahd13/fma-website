export type Step = {
  id: string,
  name: string,
  getFields: (formType?: string) => string[],
}
