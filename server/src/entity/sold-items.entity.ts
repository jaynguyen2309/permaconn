import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Column,
  OneToMany,
} from "typeorm";
import { Products } from "./products.entity";
import { Users } from "./users.entity";

@Entity()
export class SoldItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { array: true })
  products: string[];

  @ManyToOne(() => Users, (user) => user.email)
  purchasedUser: Users;

  @Column({ type: "real" })
  total: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
