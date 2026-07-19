import { NotFoundError } from "../errors";
import { incomeTaxRepository } from "../repositories/incometaxRepository";
import { userRepository } from "../repositories/userRepository";
import { IncomeTaxDto } from "../types";
import { Err, isErr } from "../utils/errorGuards";

export const getIncomeTaxByStateService = async (
  state: string,
  salary: number,
) => {
  const taxlistMarried: IncomeTaxDto[] | Err =
    await incomeTaxRepository.findByStateLt(state, salary);
  const taxlistSingle: IncomeTaxDto[] | Err =
    await incomeTaxRepository.findByStateLt(state, salary, false);

  if (isErr(taxlistMarried) || isErr(taxlistSingle)) {
    throw new NotFoundError();
  }

  return { married: taxlistMarried, single: taxlistSingle };
};

export const getIncomeTaxService = async (state: string) => {
  const taxes: IncomeTaxDto[] | Err =
    await incomeTaxRepository.findByState(state);
  if (isErr(taxes)) {
    throw new NotFoundError();
  }

  return {
    married: taxes.filter((e) => e.married),
    single: taxes.filter((e) => !e.married),
  };
};

export const getIncomeTaxByUserService = async (
  userid: number,
  state: string,
) => {
  const userObj = await userRepository.findById(userid);
  if (isErr(userObj) || !userObj || !userObj.salary) {
    throw new NotFoundError();
  }

  return getIncomeTaxByStateService(state, userObj.salary);
};
