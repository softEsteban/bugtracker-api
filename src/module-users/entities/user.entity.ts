import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import Profile from './profile.entity';
import Company from './company.entity';

@Entity({ name: "sch_generic.tb_user" })
export default class User {
    @PrimaryGeneratedColumn()
    use_code: number;

    @Column()
    use_name: string;

    @Column()
    use_lastname: string;

    @Column()
    use_type: string;

    @Column()
    use_datins: Date;

    @Column()
    use_datupd: Date;

    @Column()
    use_email: string;

    @Column()
    use_pass: string;

    @Column()
    use_github: string;

    // @OneToOne(() => Profile)
    // @JoinColumn()
    @Column()
    pro_code: string;

    // @OneToOne(() => Company)
    // @JoinColumn()
    @Column()
    cop_code: string;
}