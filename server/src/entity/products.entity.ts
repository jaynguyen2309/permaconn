import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  brand: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column({
    nullable: true,
  })
  thumbnail: string;

  @Column({
    type: "real",
  })
  discountPercentage: string;

  @Column({
    type: "real",
  })
  rating: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
