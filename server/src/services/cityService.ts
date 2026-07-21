import { NotFoundError } from "../errors";
import { cityRepository } from "../repositories/cityRepository";
import { CityDto } from "../types";
import { isErr } from "../utils/errorGuards";

export const getManyCitiesService = async (
  like?: string,
): Promise<CityDto[]> => {
  let cities: CityDto[];
  if (like) {
    const r = await cityRepository.findByLike(like);
    if (isErr(r)) cities = [];
    else cities = r;
  } else {
    const r = await cityRepository.getAll();
    if (isErr(r)) cities = [];
    else cities = r;
  }
  return cities;
};

export const getCityService = async (id: number): Promise<CityDto> => {
  const city = await cityRepository.findById(id);
  if (isErr(city) || !city) {
    throw new NotFoundError("City");
  }
  return city as CityDto;
};
