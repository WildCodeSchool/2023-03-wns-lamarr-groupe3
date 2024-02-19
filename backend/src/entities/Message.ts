import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 100 })
	email: string;

	@Column({ type: "varchar", length: 100 })
	title: string;

	@Column("text")
	message: string;
}
