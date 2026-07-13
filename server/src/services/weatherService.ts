import { NotFoundError } from "../errors";
import { weatherRepository } from "../repositories/weatherRepository";
import { WeatherDto } from "../types";
import { isErr } from "../utils/errorGuards";

export const getWeatherByCityIdService = async (
  id: number,
): Promise<WeatherDto> => {
  const temp = await weatherRepository.findByCityId(id);
  if (isErr(temp) || !temp) throw new NotFoundError("Weather");
  return temp;
};

export const getAllWeatherService = async (): Promise<WeatherDto[]> => {
  const temp = await weatherRepository.getAll();
  if (isErr(temp) || !temp) throw new NotFoundError("Weather");
  return temp;
};
