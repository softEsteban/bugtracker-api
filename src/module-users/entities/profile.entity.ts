import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "sch_generic.tb_profile" })
export default class Profile {
    @PrimaryGeneratedColumn()
    pro_code: number;

    @Column()
    pro_name: string;

    @Column()
    pro_config: string;

    @Column()
    pro_datins: Date;
}
