import {
   Entity,
   PrimaryColumn,
   Column,
   ManyToMany,
   JoinTable,
   PrimaryGeneratedColumn,
   Point,
} from 'typeorm';

export class City {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ type: 'varchar', length: 100 })
   name: string;

   @Column({ type: 'geometry' })
   coordinates: Point;

   @Column()
   image: string;
}
