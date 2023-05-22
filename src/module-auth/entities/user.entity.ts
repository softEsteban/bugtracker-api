import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "sch_generic.tb_user" })
export default class User {
    @PrimaryGeneratedColumn()
    use_code: number;

    @Column()
    use_email: string;

    @Column()
    use_pass: string;

    @Column()
    use_name: string;

    @Column()
    use_type: string;

    @Column()
    use_datins: Date;

    @Column()
    use_datupd: Date;

    @Column()
    use_lastname: string;

    @Column()
    confirmed_email: string;

    @Column()
    cop_code: string;

    @Column()
    pro_code: string;
}