import { userCreateInput, userUpdateInput } from "../generated/prisma/models";
import { User, UserWithPassword } from "../types";
import { Err } from "../utils/errorGuards";

export interface UserRepository {
  findById(id: number): Promise<User | null | Err>;
  findByIdIncludePassword(id: number): Promise<UserWithPassword | null | Err>;
  getAll(): Promise<User[] | Err>;
  create(data: userCreateInput): Promise<User | Err>;
  editById(id: number, data: userUpdateInput): Promise<User | Err>;
  deleteById(id: number): Promise<void | Err>;
}
