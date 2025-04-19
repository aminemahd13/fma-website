import ApiMethods from "./ApiMethods";

export const getAllFormSchemas = () => {
  const url = 'form-schemas';
  return ApiMethods.get(url);
};

export const getActiveFormSchema = () => {
  const url = 'form-schemas/active';
  return ApiMethods.get(url);
};

export const getFormSchemaById = (id: number) => {
  const url = `form-schemas/${id}`;
  return ApiMethods.get(url);
};

export const createFormSchema = (data: any) => {
  const url = 'form-schemas';
  return ApiMethods.post(url, data);
};

export const updateFormSchema = (id: number, data: any) => {
  const url = `form-schemas/${id}`;
  return ApiMethods.put(url, data);
};

export const deleteFormSchema = (id: number) => {
  const url = `form-schemas/${id}`;
  return ApiMethods.delete(url);
};

export const activateFormSchema = (id: number) => {
  const url = `form-schemas/${id}/activate`;
  return ApiMethods.put(url, {});
};