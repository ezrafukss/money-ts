import { Integer } from './Integer'
import { NonZeroInteger } from './NonZeroInteger'
import * as integer from './Integer'
import { Setoid } from 'fp-ts/lib/Setoid'
import { Ord } from 'fp-ts/lib/Ord'

export interface Format<D extends string, U extends string | number | symbol> {
  dimension: D
  unit: U
}

export class Discrete<D extends string, U extends string | number | symbol> {
  constructor(readonly format: Format<D, U>, readonly value: Integer) {}
  add(y: Discrete<D, U>): Discrete<D, U> {
    return new Discrete(this.format, integer.add(this.value, y.value))
  }
  mul(y: Integer): Discrete<D, U> {
    return new Discrete(this.format, integer.mul(this.value, y))
  }
  negate(): Discrete<D, U> {
    return new Discrete(this.format, integer.negate(this.value))
  }
  sub(y: Discrete<D, U>): Discrete<D, U> {
    return new Discrete(this.format, integer.sub(this.value, y.value))
  }
  div(y: NonZeroInteger): Discrete<D, U> {
    return new Discrete(this.format, integer.div(this.value, y))
  }
  isZero(): boolean {
    return integer.isZero(this.value)
  }
  inspect(): string {
    return this.toString()
  }
  toString(): string {
    return `${this.format.dimension} ${this.format.unit} ${integer.show(this.value)}`
  }
}

export function getOne<D extends string, U extends string>(format: Format<D, U>): Discrete<D, U> {
  return new Discrete(format, integer.one)
}

export function getZero<D extends string, U extends string>(format: Format<D, U>): Discrete<D, U> {
  return new Discrete(format, integer.zero)
}

export function getSetoid<D extends string, U extends string>(): Setoid<Discrete<D, U>> {
  return {
    equals: (x, y) => integer.setoid.equals(x.value, y.value)
  }
}

export function getOrd<D extends string, U extends string>(): Ord<Discrete<D, U>> {
  return {
    ...getSetoid(),
    compare: (x, y) => integer.ord.compare(x.value, y.value)
  }
}
