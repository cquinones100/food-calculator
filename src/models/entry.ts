import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Food } from "./food";

@Table({
  timestamps: true,
})
export class Entry extends Model {
  @BelongsTo(() => Food)
  food!: Food;

  @AllowNull(false) @Column(DataType.DATE) date!: Date;
  @AllowNull(false) @Column(DataType.NUMBER) servingSize!: number;
  @AllowNull(false) @Column(DataType.NUMBER) totalWeight!: number;

  @ForeignKey(() => Food)
  @Column(DataType.NUMBER)
  foodId!: number;
}
