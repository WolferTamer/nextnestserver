import { NotFoundError } from "../errors";
import { taxRepository } from "../repositories/taxRepository";
import { TaxDto } from "../types";
import { isErr } from "../utils/errorGuards";

export const getTaxByCityIdService = async (id: number): Promise<TaxDto> => {
  const temp = await taxRepository.findByCityId(id);
  if (isErr(temp) || !temp) throw new NotFoundError("Tax");
  return temp;
};

export const getAllTaxesService = async (): Promise<TaxDto[]> => {
  const temp = await taxRepository.getAll();
  if (isErr(temp)) throw new NotFoundError("Tax");
  return temp;
};
