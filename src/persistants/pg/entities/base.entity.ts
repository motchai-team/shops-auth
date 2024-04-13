import { BaseEntity, BeforeInsert, BeforeUpdate, Column } from 'typeorm';

export abstract class Base extends BaseEntity {
    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @BeforeInsert()
    updateTimestampsOnInsert() {
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    @BeforeUpdate()
    updateTimestampsOnUpdate() {
        this.updated_at = new Date();
    }
}
