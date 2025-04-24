import ApiMethods from "./ApiMethods";

export const getAllCompetitionResults = () => {
  const url = 'competition-results';
  return ApiMethods.get(url);
}

export const getCompetitionResultById = (id: number) => {
  const url = `competition-results/${id}`;
  return ApiMethods.get(url);
}