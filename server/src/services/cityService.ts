import { NotFoundError } from "../errors";
import { cityInclude } from "../generated/prisma/models";
import { cityRepository } from "../repositories/cityRepository";
import { CityDto } from "../types";
import { isErr } from "../utils/errorGuards";

export const getManyCitiesService = async (
  like?: string,
  include?: {
    weather: boolean;
    taxes: boolean;
  },
): Promise<CityDto[]> => {
  let cities: CityDto[];
  const includeObj: cityInclude = {};
  if (include?.weather) {
    includeObj.weather = true;
  }
  if (include?.taxes) {
    includeObj.tax = true;
  }
  if (like) {
    const r = await cityRepository.findByLike(like, includeObj);
    if (isErr(r)) cities = [];
    else cities = r;
  } else {
    const r = await cityRepository.getAll(includeObj);
    if (isErr(r)) cities = [];
    else cities = r;
  }
  return cities;
};

export const getCityService = async (
  id: number,
  include?: {
    weather: boolean;
    taxes: boolean;
  },
): Promise<CityDto> => {
  const includeObj: cityInclude = {};
  if (include?.weather) {
    includeObj.weather = true;
  }
  if (include?.taxes) {
    includeObj.tax = true;
  }
  const city = await cityRepository.findById(id, includeObj);
  if (isErr(city) || !city) {
    throw new NotFoundError("City");
  }
  return city as CityDto;
};
