import {
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
  Point,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Entity,
} from "typeorm";
import { Category } from "./Category";
import { City } from "./City";
import { User } from "./User";

@Entity()
export class Poi {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column("point")
  coordinates: Point;

  // ajout du type text
  @Column("text")
  description: string;

  // ajout du type text
  @Column("text")
  address: string;

  // ajout du type text
  @Column("text")
  image: string;

  // ajout du type boolean
  @Column("boolean")
  is_accepted: boolean;

  // ajout du type date (comme indiqué dans la doc)
  @CreateDateColumn()
  created_at: Date;

  // ajout du type date (comme indiqué dans la doc)
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Category, (category) => category.poi)
  category: Category;

  @ManyToOne(() => City, (city) => city.poi)
  city: City;

  @ManyToOne(() => User, (user) => user.createdPoi)
  user: User;

  // @ManyToMany(() => User, (user) => user.favouritePoi)
  // users: User[];
}
