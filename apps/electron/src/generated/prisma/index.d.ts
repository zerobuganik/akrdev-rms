
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model LocalOrder
 * 
 */
export type LocalOrder = $Result.DefaultSelection<Prisma.$LocalOrderPayload>
/**
 * Model LocalOrderItem
 * 
 */
export type LocalOrderItem = $Result.DefaultSelection<Prisma.$LocalOrderItemPayload>
/**
 * Model LocalKOT
 * 
 */
export type LocalKOT = $Result.DefaultSelection<Prisma.$LocalKOTPayload>
/**
 * Model LocalSettlement
 * 
 */
export type LocalSettlement = $Result.DefaultSelection<Prisma.$LocalSettlementPayload>
/**
 * Model SyncQueue
 * 
 */
export type SyncQueue = $Result.DefaultSelection<Prisma.$SyncQueuePayload>
/**
 * Model SyncState
 * 
 */
export type SyncState = $Result.DefaultSelection<Prisma.$SyncStatePayload>
/**
 * Model PrinterConfig
 * 
 */
export type PrinterConfig = $Result.DefaultSelection<Prisma.$PrinterConfigPayload>
/**
 * Model PrintHistory
 * 
 */
export type PrintHistory = $Result.DefaultSelection<Prisma.$PrintHistoryPayload>
/**
 * Model LocalCredential
 * 
 */
export type LocalCredential = $Result.DefaultSelection<Prisma.$LocalCredentialPayload>
/**
 * Model CachedTable
 * 
 */
export type CachedTable = $Result.DefaultSelection<Prisma.$CachedTablePayload>
/**
 * Model CachedCategory
 * 
 */
export type CachedCategory = $Result.DefaultSelection<Prisma.$CachedCategoryPayload>
/**
 * Model CachedArea
 * 
 */
export type CachedArea = $Result.DefaultSelection<Prisma.$CachedAreaPayload>
/**
 * Model CachedItem
 * 
 */
export type CachedItem = $Result.DefaultSelection<Prisma.$CachedItemPayload>
/**
 * Model CachedSetting
 * 
 */
export type CachedSetting = $Result.DefaultSelection<Prisma.$CachedSettingPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more LocalOrders
 * const localOrders = await prisma.localOrder.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more LocalOrders
   * const localOrders = await prisma.localOrder.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.localOrder`: Exposes CRUD operations for the **LocalOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalOrders
    * const localOrders = await prisma.localOrder.findMany()
    * ```
    */
  get localOrder(): Prisma.LocalOrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localOrderItem`: Exposes CRUD operations for the **LocalOrderItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalOrderItems
    * const localOrderItems = await prisma.localOrderItem.findMany()
    * ```
    */
  get localOrderItem(): Prisma.LocalOrderItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localKOT`: Exposes CRUD operations for the **LocalKOT** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalKOTS
    * const localKOTS = await prisma.localKOT.findMany()
    * ```
    */
  get localKOT(): Prisma.LocalKOTDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localSettlement`: Exposes CRUD operations for the **LocalSettlement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalSettlements
    * const localSettlements = await prisma.localSettlement.findMany()
    * ```
    */
  get localSettlement(): Prisma.LocalSettlementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.syncQueue`: Exposes CRUD operations for the **SyncQueue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SyncQueues
    * const syncQueues = await prisma.syncQueue.findMany()
    * ```
    */
  get syncQueue(): Prisma.SyncQueueDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.syncState`: Exposes CRUD operations for the **SyncState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SyncStates
    * const syncStates = await prisma.syncState.findMany()
    * ```
    */
  get syncState(): Prisma.SyncStateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.printerConfig`: Exposes CRUD operations for the **PrinterConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PrinterConfigs
    * const printerConfigs = await prisma.printerConfig.findMany()
    * ```
    */
  get printerConfig(): Prisma.PrinterConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.printHistory`: Exposes CRUD operations for the **PrintHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PrintHistories
    * const printHistories = await prisma.printHistory.findMany()
    * ```
    */
  get printHistory(): Prisma.PrintHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localCredential`: Exposes CRUD operations for the **LocalCredential** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalCredentials
    * const localCredentials = await prisma.localCredential.findMany()
    * ```
    */
  get localCredential(): Prisma.LocalCredentialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cachedTable`: Exposes CRUD operations for the **CachedTable** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CachedTables
    * const cachedTables = await prisma.cachedTable.findMany()
    * ```
    */
  get cachedTable(): Prisma.CachedTableDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cachedCategory`: Exposes CRUD operations for the **CachedCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CachedCategories
    * const cachedCategories = await prisma.cachedCategory.findMany()
    * ```
    */
  get cachedCategory(): Prisma.CachedCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cachedArea`: Exposes CRUD operations for the **CachedArea** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CachedAreas
    * const cachedAreas = await prisma.cachedArea.findMany()
    * ```
    */
  get cachedArea(): Prisma.CachedAreaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cachedItem`: Exposes CRUD operations for the **CachedItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CachedItems
    * const cachedItems = await prisma.cachedItem.findMany()
    * ```
    */
  get cachedItem(): Prisma.CachedItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cachedSetting`: Exposes CRUD operations for the **CachedSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CachedSettings
    * const cachedSettings = await prisma.cachedSetting.findMany()
    * ```
    */
  get cachedSetting(): Prisma.CachedSettingDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    LocalOrder: 'LocalOrder',
    LocalOrderItem: 'LocalOrderItem',
    LocalKOT: 'LocalKOT',
    LocalSettlement: 'LocalSettlement',
    SyncQueue: 'SyncQueue',
    SyncState: 'SyncState',
    PrinterConfig: 'PrinterConfig',
    PrintHistory: 'PrintHistory',
    LocalCredential: 'LocalCredential',
    CachedTable: 'CachedTable',
    CachedCategory: 'CachedCategory',
    CachedArea: 'CachedArea',
    CachedItem: 'CachedItem',
    CachedSetting: 'CachedSetting'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "localOrder" | "localOrderItem" | "localKOT" | "localSettlement" | "syncQueue" | "syncState" | "printerConfig" | "printHistory" | "localCredential" | "cachedTable" | "cachedCategory" | "cachedArea" | "cachedItem" | "cachedSetting"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      LocalOrder: {
        payload: Prisma.$LocalOrderPayload<ExtArgs>
        fields: Prisma.LocalOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          findFirst: {
            args: Prisma.LocalOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          findMany: {
            args: Prisma.LocalOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>[]
          }
          create: {
            args: Prisma.LocalOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          createMany: {
            args: Prisma.LocalOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>[]
          }
          delete: {
            args: Prisma.LocalOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          update: {
            args: Prisma.LocalOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          deleteMany: {
            args: Prisma.LocalOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalOrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>[]
          }
          upsert: {
            args: Prisma.LocalOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderPayload>
          }
          aggregate: {
            args: Prisma.LocalOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalOrder>
          }
          groupBy: {
            args: Prisma.LocalOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalOrderCountArgs<ExtArgs>
            result: $Utils.Optional<LocalOrderCountAggregateOutputType> | number
          }
        }
      }
      LocalOrderItem: {
        payload: Prisma.$LocalOrderItemPayload<ExtArgs>
        fields: Prisma.LocalOrderItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalOrderItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalOrderItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderItemPayload>
          }
          findFirst: {
            args: Prisma.LocalOrderItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalOrderItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderItemPayload>
          }
          findMany: {
            args: Prisma.LocalOrderItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderItemPayload>[]
          }
          create: {
            args: Prisma.LocalOrderItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderItemPayload>
          }
          createMany: {
            args: Prisma.LocalOrderItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalOrderItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderItemPayload>[]
          }
          delete: {
            args: Prisma.LocalOrderItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderItemPayload>
          }
          update: {
            args: Prisma.LocalOrderItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderItemPayload>
          }
          deleteMany: {
            args: Prisma.LocalOrderItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalOrderItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalOrderItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderItemPayload>[]
          }
          upsert: {
            args: Prisma.LocalOrderItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalOrderItemPayload>
          }
          aggregate: {
            args: Prisma.LocalOrderItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalOrderItem>
          }
          groupBy: {
            args: Prisma.LocalOrderItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalOrderItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalOrderItemCountArgs<ExtArgs>
            result: $Utils.Optional<LocalOrderItemCountAggregateOutputType> | number
          }
        }
      }
      LocalKOT: {
        payload: Prisma.$LocalKOTPayload<ExtArgs>
        fields: Prisma.LocalKOTFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalKOTFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalKOTPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalKOTFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalKOTPayload>
          }
          findFirst: {
            args: Prisma.LocalKOTFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalKOTPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalKOTFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalKOTPayload>
          }
          findMany: {
            args: Prisma.LocalKOTFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalKOTPayload>[]
          }
          create: {
            args: Prisma.LocalKOTCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalKOTPayload>
          }
          createMany: {
            args: Prisma.LocalKOTCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalKOTCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalKOTPayload>[]
          }
          delete: {
            args: Prisma.LocalKOTDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalKOTPayload>
          }
          update: {
            args: Prisma.LocalKOTUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalKOTPayload>
          }
          deleteMany: {
            args: Prisma.LocalKOTDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalKOTUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalKOTUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalKOTPayload>[]
          }
          upsert: {
            args: Prisma.LocalKOTUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalKOTPayload>
          }
          aggregate: {
            args: Prisma.LocalKOTAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalKOT>
          }
          groupBy: {
            args: Prisma.LocalKOTGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalKOTGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalKOTCountArgs<ExtArgs>
            result: $Utils.Optional<LocalKOTCountAggregateOutputType> | number
          }
        }
      }
      LocalSettlement: {
        payload: Prisma.$LocalSettlementPayload<ExtArgs>
        fields: Prisma.LocalSettlementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalSettlementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSettlementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalSettlementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSettlementPayload>
          }
          findFirst: {
            args: Prisma.LocalSettlementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSettlementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalSettlementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSettlementPayload>
          }
          findMany: {
            args: Prisma.LocalSettlementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSettlementPayload>[]
          }
          create: {
            args: Prisma.LocalSettlementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSettlementPayload>
          }
          createMany: {
            args: Prisma.LocalSettlementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalSettlementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSettlementPayload>[]
          }
          delete: {
            args: Prisma.LocalSettlementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSettlementPayload>
          }
          update: {
            args: Prisma.LocalSettlementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSettlementPayload>
          }
          deleteMany: {
            args: Prisma.LocalSettlementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalSettlementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalSettlementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSettlementPayload>[]
          }
          upsert: {
            args: Prisma.LocalSettlementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSettlementPayload>
          }
          aggregate: {
            args: Prisma.LocalSettlementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalSettlement>
          }
          groupBy: {
            args: Prisma.LocalSettlementGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalSettlementGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalSettlementCountArgs<ExtArgs>
            result: $Utils.Optional<LocalSettlementCountAggregateOutputType> | number
          }
        }
      }
      SyncQueue: {
        payload: Prisma.$SyncQueuePayload<ExtArgs>
        fields: Prisma.SyncQueueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SyncQueueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SyncQueueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          findFirst: {
            args: Prisma.SyncQueueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SyncQueueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          findMany: {
            args: Prisma.SyncQueueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>[]
          }
          create: {
            args: Prisma.SyncQueueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          createMany: {
            args: Prisma.SyncQueueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SyncQueueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>[]
          }
          delete: {
            args: Prisma.SyncQueueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          update: {
            args: Prisma.SyncQueueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          deleteMany: {
            args: Prisma.SyncQueueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SyncQueueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SyncQueueUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>[]
          }
          upsert: {
            args: Prisma.SyncQueueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueuePayload>
          }
          aggregate: {
            args: Prisma.SyncQueueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSyncQueue>
          }
          groupBy: {
            args: Prisma.SyncQueueGroupByArgs<ExtArgs>
            result: $Utils.Optional<SyncQueueGroupByOutputType>[]
          }
          count: {
            args: Prisma.SyncQueueCountArgs<ExtArgs>
            result: $Utils.Optional<SyncQueueCountAggregateOutputType> | number
          }
        }
      }
      SyncState: {
        payload: Prisma.$SyncStatePayload<ExtArgs>
        fields: Prisma.SyncStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SyncStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SyncStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncStatePayload>
          }
          findFirst: {
            args: Prisma.SyncStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SyncStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncStatePayload>
          }
          findMany: {
            args: Prisma.SyncStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncStatePayload>[]
          }
          create: {
            args: Prisma.SyncStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncStatePayload>
          }
          createMany: {
            args: Prisma.SyncStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SyncStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncStatePayload>[]
          }
          delete: {
            args: Prisma.SyncStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncStatePayload>
          }
          update: {
            args: Prisma.SyncStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncStatePayload>
          }
          deleteMany: {
            args: Prisma.SyncStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SyncStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SyncStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncStatePayload>[]
          }
          upsert: {
            args: Prisma.SyncStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncStatePayload>
          }
          aggregate: {
            args: Prisma.SyncStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSyncState>
          }
          groupBy: {
            args: Prisma.SyncStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<SyncStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.SyncStateCountArgs<ExtArgs>
            result: $Utils.Optional<SyncStateCountAggregateOutputType> | number
          }
        }
      }
      PrinterConfig: {
        payload: Prisma.$PrinterConfigPayload<ExtArgs>
        fields: Prisma.PrinterConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PrinterConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrinterConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PrinterConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrinterConfigPayload>
          }
          findFirst: {
            args: Prisma.PrinterConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrinterConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PrinterConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrinterConfigPayload>
          }
          findMany: {
            args: Prisma.PrinterConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrinterConfigPayload>[]
          }
          create: {
            args: Prisma.PrinterConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrinterConfigPayload>
          }
          createMany: {
            args: Prisma.PrinterConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PrinterConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrinterConfigPayload>[]
          }
          delete: {
            args: Prisma.PrinterConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrinterConfigPayload>
          }
          update: {
            args: Prisma.PrinterConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrinterConfigPayload>
          }
          deleteMany: {
            args: Prisma.PrinterConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PrinterConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PrinterConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrinterConfigPayload>[]
          }
          upsert: {
            args: Prisma.PrinterConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrinterConfigPayload>
          }
          aggregate: {
            args: Prisma.PrinterConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrinterConfig>
          }
          groupBy: {
            args: Prisma.PrinterConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<PrinterConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.PrinterConfigCountArgs<ExtArgs>
            result: $Utils.Optional<PrinterConfigCountAggregateOutputType> | number
          }
        }
      }
      PrintHistory: {
        payload: Prisma.$PrintHistoryPayload<ExtArgs>
        fields: Prisma.PrintHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PrintHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrintHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PrintHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrintHistoryPayload>
          }
          findFirst: {
            args: Prisma.PrintHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrintHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PrintHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrintHistoryPayload>
          }
          findMany: {
            args: Prisma.PrintHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrintHistoryPayload>[]
          }
          create: {
            args: Prisma.PrintHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrintHistoryPayload>
          }
          createMany: {
            args: Prisma.PrintHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PrintHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrintHistoryPayload>[]
          }
          delete: {
            args: Prisma.PrintHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrintHistoryPayload>
          }
          update: {
            args: Prisma.PrintHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrintHistoryPayload>
          }
          deleteMany: {
            args: Prisma.PrintHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PrintHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PrintHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrintHistoryPayload>[]
          }
          upsert: {
            args: Prisma.PrintHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrintHistoryPayload>
          }
          aggregate: {
            args: Prisma.PrintHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrintHistory>
          }
          groupBy: {
            args: Prisma.PrintHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<PrintHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.PrintHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<PrintHistoryCountAggregateOutputType> | number
          }
        }
      }
      LocalCredential: {
        payload: Prisma.$LocalCredentialPayload<ExtArgs>
        fields: Prisma.LocalCredentialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalCredentialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCredentialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalCredentialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCredentialPayload>
          }
          findFirst: {
            args: Prisma.LocalCredentialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCredentialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalCredentialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCredentialPayload>
          }
          findMany: {
            args: Prisma.LocalCredentialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCredentialPayload>[]
          }
          create: {
            args: Prisma.LocalCredentialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCredentialPayload>
          }
          createMany: {
            args: Prisma.LocalCredentialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalCredentialCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCredentialPayload>[]
          }
          delete: {
            args: Prisma.LocalCredentialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCredentialPayload>
          }
          update: {
            args: Prisma.LocalCredentialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCredentialPayload>
          }
          deleteMany: {
            args: Prisma.LocalCredentialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalCredentialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalCredentialUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCredentialPayload>[]
          }
          upsert: {
            args: Prisma.LocalCredentialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCredentialPayload>
          }
          aggregate: {
            args: Prisma.LocalCredentialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalCredential>
          }
          groupBy: {
            args: Prisma.LocalCredentialGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalCredentialGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalCredentialCountArgs<ExtArgs>
            result: $Utils.Optional<LocalCredentialCountAggregateOutputType> | number
          }
        }
      }
      CachedTable: {
        payload: Prisma.$CachedTablePayload<ExtArgs>
        fields: Prisma.CachedTableFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CachedTableFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedTablePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CachedTableFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedTablePayload>
          }
          findFirst: {
            args: Prisma.CachedTableFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedTablePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CachedTableFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedTablePayload>
          }
          findMany: {
            args: Prisma.CachedTableFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedTablePayload>[]
          }
          create: {
            args: Prisma.CachedTableCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedTablePayload>
          }
          createMany: {
            args: Prisma.CachedTableCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CachedTableCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedTablePayload>[]
          }
          delete: {
            args: Prisma.CachedTableDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedTablePayload>
          }
          update: {
            args: Prisma.CachedTableUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedTablePayload>
          }
          deleteMany: {
            args: Prisma.CachedTableDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CachedTableUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CachedTableUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedTablePayload>[]
          }
          upsert: {
            args: Prisma.CachedTableUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedTablePayload>
          }
          aggregate: {
            args: Prisma.CachedTableAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCachedTable>
          }
          groupBy: {
            args: Prisma.CachedTableGroupByArgs<ExtArgs>
            result: $Utils.Optional<CachedTableGroupByOutputType>[]
          }
          count: {
            args: Prisma.CachedTableCountArgs<ExtArgs>
            result: $Utils.Optional<CachedTableCountAggregateOutputType> | number
          }
        }
      }
      CachedCategory: {
        payload: Prisma.$CachedCategoryPayload<ExtArgs>
        fields: Prisma.CachedCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CachedCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CachedCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedCategoryPayload>
          }
          findFirst: {
            args: Prisma.CachedCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CachedCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedCategoryPayload>
          }
          findMany: {
            args: Prisma.CachedCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedCategoryPayload>[]
          }
          create: {
            args: Prisma.CachedCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedCategoryPayload>
          }
          createMany: {
            args: Prisma.CachedCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CachedCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedCategoryPayload>[]
          }
          delete: {
            args: Prisma.CachedCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedCategoryPayload>
          }
          update: {
            args: Prisma.CachedCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedCategoryPayload>
          }
          deleteMany: {
            args: Prisma.CachedCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CachedCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CachedCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedCategoryPayload>[]
          }
          upsert: {
            args: Prisma.CachedCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedCategoryPayload>
          }
          aggregate: {
            args: Prisma.CachedCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCachedCategory>
          }
          groupBy: {
            args: Prisma.CachedCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CachedCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CachedCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CachedCategoryCountAggregateOutputType> | number
          }
        }
      }
      CachedArea: {
        payload: Prisma.$CachedAreaPayload<ExtArgs>
        fields: Prisma.CachedAreaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CachedAreaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedAreaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CachedAreaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedAreaPayload>
          }
          findFirst: {
            args: Prisma.CachedAreaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedAreaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CachedAreaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedAreaPayload>
          }
          findMany: {
            args: Prisma.CachedAreaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedAreaPayload>[]
          }
          create: {
            args: Prisma.CachedAreaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedAreaPayload>
          }
          createMany: {
            args: Prisma.CachedAreaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CachedAreaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedAreaPayload>[]
          }
          delete: {
            args: Prisma.CachedAreaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedAreaPayload>
          }
          update: {
            args: Prisma.CachedAreaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedAreaPayload>
          }
          deleteMany: {
            args: Prisma.CachedAreaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CachedAreaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CachedAreaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedAreaPayload>[]
          }
          upsert: {
            args: Prisma.CachedAreaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedAreaPayload>
          }
          aggregate: {
            args: Prisma.CachedAreaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCachedArea>
          }
          groupBy: {
            args: Prisma.CachedAreaGroupByArgs<ExtArgs>
            result: $Utils.Optional<CachedAreaGroupByOutputType>[]
          }
          count: {
            args: Prisma.CachedAreaCountArgs<ExtArgs>
            result: $Utils.Optional<CachedAreaCountAggregateOutputType> | number
          }
        }
      }
      CachedItem: {
        payload: Prisma.$CachedItemPayload<ExtArgs>
        fields: Prisma.CachedItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CachedItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CachedItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedItemPayload>
          }
          findFirst: {
            args: Prisma.CachedItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CachedItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedItemPayload>
          }
          findMany: {
            args: Prisma.CachedItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedItemPayload>[]
          }
          create: {
            args: Prisma.CachedItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedItemPayload>
          }
          createMany: {
            args: Prisma.CachedItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CachedItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedItemPayload>[]
          }
          delete: {
            args: Prisma.CachedItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedItemPayload>
          }
          update: {
            args: Prisma.CachedItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedItemPayload>
          }
          deleteMany: {
            args: Prisma.CachedItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CachedItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CachedItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedItemPayload>[]
          }
          upsert: {
            args: Prisma.CachedItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedItemPayload>
          }
          aggregate: {
            args: Prisma.CachedItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCachedItem>
          }
          groupBy: {
            args: Prisma.CachedItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<CachedItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.CachedItemCountArgs<ExtArgs>
            result: $Utils.Optional<CachedItemCountAggregateOutputType> | number
          }
        }
      }
      CachedSetting: {
        payload: Prisma.$CachedSettingPayload<ExtArgs>
        fields: Prisma.CachedSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CachedSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CachedSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedSettingPayload>
          }
          findFirst: {
            args: Prisma.CachedSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CachedSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedSettingPayload>
          }
          findMany: {
            args: Prisma.CachedSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedSettingPayload>[]
          }
          create: {
            args: Prisma.CachedSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedSettingPayload>
          }
          createMany: {
            args: Prisma.CachedSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CachedSettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedSettingPayload>[]
          }
          delete: {
            args: Prisma.CachedSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedSettingPayload>
          }
          update: {
            args: Prisma.CachedSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedSettingPayload>
          }
          deleteMany: {
            args: Prisma.CachedSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CachedSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CachedSettingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedSettingPayload>[]
          }
          upsert: {
            args: Prisma.CachedSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedSettingPayload>
          }
          aggregate: {
            args: Prisma.CachedSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCachedSetting>
          }
          groupBy: {
            args: Prisma.CachedSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<CachedSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.CachedSettingCountArgs<ExtArgs>
            result: $Utils.Optional<CachedSettingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    localOrder?: LocalOrderOmit
    localOrderItem?: LocalOrderItemOmit
    localKOT?: LocalKOTOmit
    localSettlement?: LocalSettlementOmit
    syncQueue?: SyncQueueOmit
    syncState?: SyncStateOmit
    printerConfig?: PrinterConfigOmit
    printHistory?: PrintHistoryOmit
    localCredential?: LocalCredentialOmit
    cachedTable?: CachedTableOmit
    cachedCategory?: CachedCategoryOmit
    cachedArea?: CachedAreaOmit
    cachedItem?: CachedItemOmit
    cachedSetting?: CachedSettingOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type LocalOrderCountOutputType
   */

  export type LocalOrderCountOutputType = {
    items: number
    kots: number
  }

  export type LocalOrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | LocalOrderCountOutputTypeCountItemsArgs
    kots?: boolean | LocalOrderCountOutputTypeCountKotsArgs
  }

  // Custom InputTypes
  /**
   * LocalOrderCountOutputType without action
   */
  export type LocalOrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderCountOutputType
     */
    select?: LocalOrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LocalOrderCountOutputType without action
   */
  export type LocalOrderCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalOrderItemWhereInput
  }

  /**
   * LocalOrderCountOutputType without action
   */
  export type LocalOrderCountOutputTypeCountKotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalKOTWhereInput
  }


  /**
   * Count Type LocalKOTCountOutputType
   */

  export type LocalKOTCountOutputType = {
    items: number
  }

  export type LocalKOTCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | LocalKOTCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * LocalKOTCountOutputType without action
   */
  export type LocalKOTCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOTCountOutputType
     */
    select?: LocalKOTCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LocalKOTCountOutputType without action
   */
  export type LocalKOTCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalOrderItemWhereInput
  }


  /**
   * Count Type PrinterConfigCountOutputType
   */

  export type PrinterConfigCountOutputType = {
    printHistory: number
  }

  export type PrinterConfigCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    printHistory?: boolean | PrinterConfigCountOutputTypeCountPrintHistoryArgs
  }

  // Custom InputTypes
  /**
   * PrinterConfigCountOutputType without action
   */
  export type PrinterConfigCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfigCountOutputType
     */
    select?: PrinterConfigCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PrinterConfigCountOutputType without action
   */
  export type PrinterConfigCountOutputTypeCountPrintHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PrintHistoryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model LocalOrder
   */

  export type AggregateLocalOrder = {
    _count: LocalOrderCountAggregateOutputType | null
    _avg: LocalOrderAvgAggregateOutputType | null
    _sum: LocalOrderSumAggregateOutputType | null
    _min: LocalOrderMinAggregateOutputType | null
    _max: LocalOrderMaxAggregateOutputType | null
  }

  export type LocalOrderAvgAggregateOutputType = {
    guestCount: number | null
    subtotal: number | null
    taxTotal: number | null
    discountTotal: number | null
    grandTotal: number | null
  }

  export type LocalOrderSumAggregateOutputType = {
    guestCount: number | null
    subtotal: number | null
    taxTotal: number | null
    discountTotal: number | null
    grandTotal: number | null
  }

  export type LocalOrderMinAggregateOutputType = {
    id: string | null
    tableId: string | null
    tableName: string | null
    customerId: string | null
    customerPhone: string | null
    guestCount: number | null
    status: string | null
    syncStatus: string | null
    subtotal: number | null
    taxTotal: number | null
    discountTotal: number | null
    grandTotal: number | null
    orderType: string | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalOrderMaxAggregateOutputType = {
    id: string | null
    tableId: string | null
    tableName: string | null
    customerId: string | null
    customerPhone: string | null
    guestCount: number | null
    status: string | null
    syncStatus: string | null
    subtotal: number | null
    taxTotal: number | null
    discountTotal: number | null
    grandTotal: number | null
    orderType: string | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalOrderCountAggregateOutputType = {
    id: number
    tableId: number
    tableName: number
    customerId: number
    customerPhone: number
    guestCount: number
    status: number
    syncStatus: number
    subtotal: number
    taxTotal: number
    discountTotal: number
    grandTotal: number
    orderType: number
    note: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocalOrderAvgAggregateInputType = {
    guestCount?: true
    subtotal?: true
    taxTotal?: true
    discountTotal?: true
    grandTotal?: true
  }

  export type LocalOrderSumAggregateInputType = {
    guestCount?: true
    subtotal?: true
    taxTotal?: true
    discountTotal?: true
    grandTotal?: true
  }

  export type LocalOrderMinAggregateInputType = {
    id?: true
    tableId?: true
    tableName?: true
    customerId?: true
    customerPhone?: true
    guestCount?: true
    status?: true
    syncStatus?: true
    subtotal?: true
    taxTotal?: true
    discountTotal?: true
    grandTotal?: true
    orderType?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalOrderMaxAggregateInputType = {
    id?: true
    tableId?: true
    tableName?: true
    customerId?: true
    customerPhone?: true
    guestCount?: true
    status?: true
    syncStatus?: true
    subtotal?: true
    taxTotal?: true
    discountTotal?: true
    grandTotal?: true
    orderType?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalOrderCountAggregateInputType = {
    id?: true
    tableId?: true
    tableName?: true
    customerId?: true
    customerPhone?: true
    guestCount?: true
    status?: true
    syncStatus?: true
    subtotal?: true
    taxTotal?: true
    discountTotal?: true
    grandTotal?: true
    orderType?: true
    note?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocalOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalOrder to aggregate.
     */
    where?: LocalOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrders to fetch.
     */
    orderBy?: LocalOrderOrderByWithRelationInput | LocalOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalOrders
    **/
    _count?: true | LocalOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalOrderMaxAggregateInputType
  }

  export type GetLocalOrderAggregateType<T extends LocalOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalOrder[P]>
      : GetScalarType<T[P], AggregateLocalOrder[P]>
  }




  export type LocalOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalOrderWhereInput
    orderBy?: LocalOrderOrderByWithAggregationInput | LocalOrderOrderByWithAggregationInput[]
    by: LocalOrderScalarFieldEnum[] | LocalOrderScalarFieldEnum
    having?: LocalOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalOrderCountAggregateInputType | true
    _avg?: LocalOrderAvgAggregateInputType
    _sum?: LocalOrderSumAggregateInputType
    _min?: LocalOrderMinAggregateInputType
    _max?: LocalOrderMaxAggregateInputType
  }

  export type LocalOrderGroupByOutputType = {
    id: string
    tableId: string | null
    tableName: string | null
    customerId: string | null
    customerPhone: string | null
    guestCount: number
    status: string
    syncStatus: string
    subtotal: number
    taxTotal: number
    discountTotal: number
    grandTotal: number
    orderType: string
    note: string | null
    createdAt: Date
    updatedAt: Date
    _count: LocalOrderCountAggregateOutputType | null
    _avg: LocalOrderAvgAggregateOutputType | null
    _sum: LocalOrderSumAggregateOutputType | null
    _min: LocalOrderMinAggregateOutputType | null
    _max: LocalOrderMaxAggregateOutputType | null
  }

  type GetLocalOrderGroupByPayload<T extends LocalOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalOrderGroupByOutputType[P]>
            : GetScalarType<T[P], LocalOrderGroupByOutputType[P]>
        }
      >
    >


  export type LocalOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tableId?: boolean
    tableName?: boolean
    customerId?: boolean
    customerPhone?: boolean
    guestCount?: boolean
    status?: boolean
    syncStatus?: boolean
    subtotal?: boolean
    taxTotal?: boolean
    discountTotal?: boolean
    grandTotal?: boolean
    orderType?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    items?: boolean | LocalOrder$itemsArgs<ExtArgs>
    kots?: boolean | LocalOrder$kotsArgs<ExtArgs>
    settlement?: boolean | LocalOrder$settlementArgs<ExtArgs>
    _count?: boolean | LocalOrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["localOrder"]>

  export type LocalOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tableId?: boolean
    tableName?: boolean
    customerId?: boolean
    customerPhone?: boolean
    guestCount?: boolean
    status?: boolean
    syncStatus?: boolean
    subtotal?: boolean
    taxTotal?: boolean
    discountTotal?: boolean
    grandTotal?: boolean
    orderType?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localOrder"]>

  export type LocalOrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tableId?: boolean
    tableName?: boolean
    customerId?: boolean
    customerPhone?: boolean
    guestCount?: boolean
    status?: boolean
    syncStatus?: boolean
    subtotal?: boolean
    taxTotal?: boolean
    discountTotal?: boolean
    grandTotal?: boolean
    orderType?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localOrder"]>

  export type LocalOrderSelectScalar = {
    id?: boolean
    tableId?: boolean
    tableName?: boolean
    customerId?: boolean
    customerPhone?: boolean
    guestCount?: boolean
    status?: boolean
    syncStatus?: boolean
    subtotal?: boolean
    taxTotal?: boolean
    discountTotal?: boolean
    grandTotal?: boolean
    orderType?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocalOrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tableId" | "tableName" | "customerId" | "customerPhone" | "guestCount" | "status" | "syncStatus" | "subtotal" | "taxTotal" | "discountTotal" | "grandTotal" | "orderType" | "note" | "createdAt" | "updatedAt", ExtArgs["result"]["localOrder"]>
  export type LocalOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | LocalOrder$itemsArgs<ExtArgs>
    kots?: boolean | LocalOrder$kotsArgs<ExtArgs>
    settlement?: boolean | LocalOrder$settlementArgs<ExtArgs>
    _count?: boolean | LocalOrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LocalOrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type LocalOrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LocalOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalOrder"
    objects: {
      items: Prisma.$LocalOrderItemPayload<ExtArgs>[]
      kots: Prisma.$LocalKOTPayload<ExtArgs>[]
      settlement: Prisma.$LocalSettlementPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tableId: string | null
      tableName: string | null
      customerId: string | null
      customerPhone: string | null
      guestCount: number
      status: string
      syncStatus: string
      subtotal: number
      taxTotal: number
      discountTotal: number
      grandTotal: number
      orderType: string
      note: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["localOrder"]>
    composites: {}
  }

  type LocalOrderGetPayload<S extends boolean | null | undefined | LocalOrderDefaultArgs> = $Result.GetResult<Prisma.$LocalOrderPayload, S>

  type LocalOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalOrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalOrderCountAggregateInputType | true
    }

  export interface LocalOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalOrder'], meta: { name: 'LocalOrder' } }
    /**
     * Find zero or one LocalOrder that matches the filter.
     * @param {LocalOrderFindUniqueArgs} args - Arguments to find a LocalOrder
     * @example
     * // Get one LocalOrder
     * const localOrder = await prisma.localOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalOrderFindUniqueArgs>(args: SelectSubset<T, LocalOrderFindUniqueArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalOrder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalOrderFindUniqueOrThrowArgs} args - Arguments to find a LocalOrder
     * @example
     * // Get one LocalOrder
     * const localOrder = await prisma.localOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderFindFirstArgs} args - Arguments to find a LocalOrder
     * @example
     * // Get one LocalOrder
     * const localOrder = await prisma.localOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalOrderFindFirstArgs>(args?: SelectSubset<T, LocalOrderFindFirstArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderFindFirstOrThrowArgs} args - Arguments to find a LocalOrder
     * @example
     * // Get one LocalOrder
     * const localOrder = await prisma.localOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalOrders
     * const localOrders = await prisma.localOrder.findMany()
     * 
     * // Get first 10 LocalOrders
     * const localOrders = await prisma.localOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localOrderWithIdOnly = await prisma.localOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalOrderFindManyArgs>(args?: SelectSubset<T, LocalOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalOrder.
     * @param {LocalOrderCreateArgs} args - Arguments to create a LocalOrder.
     * @example
     * // Create one LocalOrder
     * const LocalOrder = await prisma.localOrder.create({
     *   data: {
     *     // ... data to create a LocalOrder
     *   }
     * })
     * 
     */
    create<T extends LocalOrderCreateArgs>(args: SelectSubset<T, LocalOrderCreateArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalOrders.
     * @param {LocalOrderCreateManyArgs} args - Arguments to create many LocalOrders.
     * @example
     * // Create many LocalOrders
     * const localOrder = await prisma.localOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalOrderCreateManyArgs>(args?: SelectSubset<T, LocalOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalOrders and returns the data saved in the database.
     * @param {LocalOrderCreateManyAndReturnArgs} args - Arguments to create many LocalOrders.
     * @example
     * // Create many LocalOrders
     * const localOrder = await prisma.localOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalOrders and only return the `id`
     * const localOrderWithIdOnly = await prisma.localOrder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalOrder.
     * @param {LocalOrderDeleteArgs} args - Arguments to delete one LocalOrder.
     * @example
     * // Delete one LocalOrder
     * const LocalOrder = await prisma.localOrder.delete({
     *   where: {
     *     // ... filter to delete one LocalOrder
     *   }
     * })
     * 
     */
    delete<T extends LocalOrderDeleteArgs>(args: SelectSubset<T, LocalOrderDeleteArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalOrder.
     * @param {LocalOrderUpdateArgs} args - Arguments to update one LocalOrder.
     * @example
     * // Update one LocalOrder
     * const localOrder = await prisma.localOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalOrderUpdateArgs>(args: SelectSubset<T, LocalOrderUpdateArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalOrders.
     * @param {LocalOrderDeleteManyArgs} args - Arguments to filter LocalOrders to delete.
     * @example
     * // Delete a few LocalOrders
     * const { count } = await prisma.localOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalOrderDeleteManyArgs>(args?: SelectSubset<T, LocalOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalOrders
     * const localOrder = await prisma.localOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalOrderUpdateManyArgs>(args: SelectSubset<T, LocalOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalOrders and returns the data updated in the database.
     * @param {LocalOrderUpdateManyAndReturnArgs} args - Arguments to update many LocalOrders.
     * @example
     * // Update many LocalOrders
     * const localOrder = await prisma.localOrder.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalOrders and only return the `id`
     * const localOrderWithIdOnly = await prisma.localOrder.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalOrderUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalOrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalOrder.
     * @param {LocalOrderUpsertArgs} args - Arguments to update or create a LocalOrder.
     * @example
     * // Update or create a LocalOrder
     * const localOrder = await prisma.localOrder.upsert({
     *   create: {
     *     // ... data to create a LocalOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalOrder we want to update
     *   }
     * })
     */
    upsert<T extends LocalOrderUpsertArgs>(args: SelectSubset<T, LocalOrderUpsertArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderCountArgs} args - Arguments to filter LocalOrders to count.
     * @example
     * // Count the number of LocalOrders
     * const count = await prisma.localOrder.count({
     *   where: {
     *     // ... the filter for the LocalOrders we want to count
     *   }
     * })
    **/
    count<T extends LocalOrderCountArgs>(
      args?: Subset<T, LocalOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalOrderAggregateArgs>(args: Subset<T, LocalOrderAggregateArgs>): Prisma.PrismaPromise<GetLocalOrderAggregateType<T>>

    /**
     * Group by LocalOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalOrderGroupByArgs['orderBy'] }
        : { orderBy?: LocalOrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalOrder model
   */
  readonly fields: LocalOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends LocalOrder$itemsArgs<ExtArgs> = {}>(args?: Subset<T, LocalOrder$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    kots<T extends LocalOrder$kotsArgs<ExtArgs> = {}>(args?: Subset<T, LocalOrder$kotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    settlement<T extends LocalOrder$settlementArgs<ExtArgs> = {}>(args?: Subset<T, LocalOrder$settlementArgs<ExtArgs>>): Prisma__LocalSettlementClient<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalOrder model
   */
  interface LocalOrderFieldRefs {
    readonly id: FieldRef<"LocalOrder", 'String'>
    readonly tableId: FieldRef<"LocalOrder", 'String'>
    readonly tableName: FieldRef<"LocalOrder", 'String'>
    readonly customerId: FieldRef<"LocalOrder", 'String'>
    readonly customerPhone: FieldRef<"LocalOrder", 'String'>
    readonly guestCount: FieldRef<"LocalOrder", 'Int'>
    readonly status: FieldRef<"LocalOrder", 'String'>
    readonly syncStatus: FieldRef<"LocalOrder", 'String'>
    readonly subtotal: FieldRef<"LocalOrder", 'Float'>
    readonly taxTotal: FieldRef<"LocalOrder", 'Float'>
    readonly discountTotal: FieldRef<"LocalOrder", 'Float'>
    readonly grandTotal: FieldRef<"LocalOrder", 'Float'>
    readonly orderType: FieldRef<"LocalOrder", 'String'>
    readonly note: FieldRef<"LocalOrder", 'String'>
    readonly createdAt: FieldRef<"LocalOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"LocalOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocalOrder findUnique
   */
  export type LocalOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderInclude<ExtArgs> | null
    /**
     * Filter, which LocalOrder to fetch.
     */
    where: LocalOrderWhereUniqueInput
  }

  /**
   * LocalOrder findUniqueOrThrow
   */
  export type LocalOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderInclude<ExtArgs> | null
    /**
     * Filter, which LocalOrder to fetch.
     */
    where: LocalOrderWhereUniqueInput
  }

  /**
   * LocalOrder findFirst
   */
  export type LocalOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderInclude<ExtArgs> | null
    /**
     * Filter, which LocalOrder to fetch.
     */
    where?: LocalOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrders to fetch.
     */
    orderBy?: LocalOrderOrderByWithRelationInput | LocalOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalOrders.
     */
    cursor?: LocalOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalOrders.
     */
    distinct?: LocalOrderScalarFieldEnum | LocalOrderScalarFieldEnum[]
  }

  /**
   * LocalOrder findFirstOrThrow
   */
  export type LocalOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderInclude<ExtArgs> | null
    /**
     * Filter, which LocalOrder to fetch.
     */
    where?: LocalOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrders to fetch.
     */
    orderBy?: LocalOrderOrderByWithRelationInput | LocalOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalOrders.
     */
    cursor?: LocalOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalOrders.
     */
    distinct?: LocalOrderScalarFieldEnum | LocalOrderScalarFieldEnum[]
  }

  /**
   * LocalOrder findMany
   */
  export type LocalOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderInclude<ExtArgs> | null
    /**
     * Filter, which LocalOrders to fetch.
     */
    where?: LocalOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrders to fetch.
     */
    orderBy?: LocalOrderOrderByWithRelationInput | LocalOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalOrders.
     */
    cursor?: LocalOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalOrders.
     */
    distinct?: LocalOrderScalarFieldEnum | LocalOrderScalarFieldEnum[]
  }

  /**
   * LocalOrder create
   */
  export type LocalOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a LocalOrder.
     */
    data: XOR<LocalOrderCreateInput, LocalOrderUncheckedCreateInput>
  }

  /**
   * LocalOrder createMany
   */
  export type LocalOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalOrders.
     */
    data: LocalOrderCreateManyInput | LocalOrderCreateManyInput[]
  }

  /**
   * LocalOrder createManyAndReturn
   */
  export type LocalOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * The data used to create many LocalOrders.
     */
    data: LocalOrderCreateManyInput | LocalOrderCreateManyInput[]
  }

  /**
   * LocalOrder update
   */
  export type LocalOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a LocalOrder.
     */
    data: XOR<LocalOrderUpdateInput, LocalOrderUncheckedUpdateInput>
    /**
     * Choose, which LocalOrder to update.
     */
    where: LocalOrderWhereUniqueInput
  }

  /**
   * LocalOrder updateMany
   */
  export type LocalOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalOrders.
     */
    data: XOR<LocalOrderUpdateManyMutationInput, LocalOrderUncheckedUpdateManyInput>
    /**
     * Filter which LocalOrders to update
     */
    where?: LocalOrderWhereInput
    /**
     * Limit how many LocalOrders to update.
     */
    limit?: number
  }

  /**
   * LocalOrder updateManyAndReturn
   */
  export type LocalOrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * The data used to update LocalOrders.
     */
    data: XOR<LocalOrderUpdateManyMutationInput, LocalOrderUncheckedUpdateManyInput>
    /**
     * Filter which LocalOrders to update
     */
    where?: LocalOrderWhereInput
    /**
     * Limit how many LocalOrders to update.
     */
    limit?: number
  }

  /**
   * LocalOrder upsert
   */
  export type LocalOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the LocalOrder to update in case it exists.
     */
    where: LocalOrderWhereUniqueInput
    /**
     * In case the LocalOrder found by the `where` argument doesn't exist, create a new LocalOrder with this data.
     */
    create: XOR<LocalOrderCreateInput, LocalOrderUncheckedCreateInput>
    /**
     * In case the LocalOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalOrderUpdateInput, LocalOrderUncheckedUpdateInput>
  }

  /**
   * LocalOrder delete
   */
  export type LocalOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderInclude<ExtArgs> | null
    /**
     * Filter which LocalOrder to delete.
     */
    where: LocalOrderWhereUniqueInput
  }

  /**
   * LocalOrder deleteMany
   */
  export type LocalOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalOrders to delete
     */
    where?: LocalOrderWhereInput
    /**
     * Limit how many LocalOrders to delete.
     */
    limit?: number
  }

  /**
   * LocalOrder.items
   */
  export type LocalOrder$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
    where?: LocalOrderItemWhereInput
    orderBy?: LocalOrderItemOrderByWithRelationInput | LocalOrderItemOrderByWithRelationInput[]
    cursor?: LocalOrderItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocalOrderItemScalarFieldEnum | LocalOrderItemScalarFieldEnum[]
  }

  /**
   * LocalOrder.kots
   */
  export type LocalOrder$kotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
    where?: LocalKOTWhereInput
    orderBy?: LocalKOTOrderByWithRelationInput | LocalKOTOrderByWithRelationInput[]
    cursor?: LocalKOTWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocalKOTScalarFieldEnum | LocalKOTScalarFieldEnum[]
  }

  /**
   * LocalOrder.settlement
   */
  export type LocalOrder$settlementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementInclude<ExtArgs> | null
    where?: LocalSettlementWhereInput
  }

  /**
   * LocalOrder without action
   */
  export type LocalOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrder
     */
    select?: LocalOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrder
     */
    omit?: LocalOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderInclude<ExtArgs> | null
  }


  /**
   * Model LocalOrderItem
   */

  export type AggregateLocalOrderItem = {
    _count: LocalOrderItemCountAggregateOutputType | null
    _avg: LocalOrderItemAvgAggregateOutputType | null
    _sum: LocalOrderItemSumAggregateOutputType | null
    _min: LocalOrderItemMinAggregateOutputType | null
    _max: LocalOrderItemMaxAggregateOutputType | null
  }

  export type LocalOrderItemAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    lineTotal: number | null
  }

  export type LocalOrderItemSumAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    lineTotal: number | null
  }

  export type LocalOrderItemMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    itemId: string | null
    itemName: string | null
    variationId: string | null
    variationName: string | null
    kotId: string | null
    quantity: number | null
    unitPrice: number | null
    lineTotal: number | null
    status: string | null
    note: string | null
  }

  export type LocalOrderItemMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    itemId: string | null
    itemName: string | null
    variationId: string | null
    variationName: string | null
    kotId: string | null
    quantity: number | null
    unitPrice: number | null
    lineTotal: number | null
    status: string | null
    note: string | null
  }

  export type LocalOrderItemCountAggregateOutputType = {
    id: number
    orderId: number
    itemId: number
    itemName: number
    variationId: number
    variationName: number
    kotId: number
    quantity: number
    unitPrice: number
    lineTotal: number
    status: number
    note: number
    _all: number
  }


  export type LocalOrderItemAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    lineTotal?: true
  }

  export type LocalOrderItemSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    lineTotal?: true
  }

  export type LocalOrderItemMinAggregateInputType = {
    id?: true
    orderId?: true
    itemId?: true
    itemName?: true
    variationId?: true
    variationName?: true
    kotId?: true
    quantity?: true
    unitPrice?: true
    lineTotal?: true
    status?: true
    note?: true
  }

  export type LocalOrderItemMaxAggregateInputType = {
    id?: true
    orderId?: true
    itemId?: true
    itemName?: true
    variationId?: true
    variationName?: true
    kotId?: true
    quantity?: true
    unitPrice?: true
    lineTotal?: true
    status?: true
    note?: true
  }

  export type LocalOrderItemCountAggregateInputType = {
    id?: true
    orderId?: true
    itemId?: true
    itemName?: true
    variationId?: true
    variationName?: true
    kotId?: true
    quantity?: true
    unitPrice?: true
    lineTotal?: true
    status?: true
    note?: true
    _all?: true
  }

  export type LocalOrderItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalOrderItem to aggregate.
     */
    where?: LocalOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrderItems to fetch.
     */
    orderBy?: LocalOrderItemOrderByWithRelationInput | LocalOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalOrderItems
    **/
    _count?: true | LocalOrderItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalOrderItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalOrderItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalOrderItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalOrderItemMaxAggregateInputType
  }

  export type GetLocalOrderItemAggregateType<T extends LocalOrderItemAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalOrderItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalOrderItem[P]>
      : GetScalarType<T[P], AggregateLocalOrderItem[P]>
  }




  export type LocalOrderItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalOrderItemWhereInput
    orderBy?: LocalOrderItemOrderByWithAggregationInput | LocalOrderItemOrderByWithAggregationInput[]
    by: LocalOrderItemScalarFieldEnum[] | LocalOrderItemScalarFieldEnum
    having?: LocalOrderItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalOrderItemCountAggregateInputType | true
    _avg?: LocalOrderItemAvgAggregateInputType
    _sum?: LocalOrderItemSumAggregateInputType
    _min?: LocalOrderItemMinAggregateInputType
    _max?: LocalOrderItemMaxAggregateInputType
  }

  export type LocalOrderItemGroupByOutputType = {
    id: string
    orderId: string
    itemId: string
    itemName: string
    variationId: string | null
    variationName: string | null
    kotId: string | null
    quantity: number
    unitPrice: number
    lineTotal: number
    status: string
    note: string | null
    _count: LocalOrderItemCountAggregateOutputType | null
    _avg: LocalOrderItemAvgAggregateOutputType | null
    _sum: LocalOrderItemSumAggregateOutputType | null
    _min: LocalOrderItemMinAggregateOutputType | null
    _max: LocalOrderItemMaxAggregateOutputType | null
  }

  type GetLocalOrderItemGroupByPayload<T extends LocalOrderItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalOrderItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalOrderItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalOrderItemGroupByOutputType[P]>
            : GetScalarType<T[P], LocalOrderItemGroupByOutputType[P]>
        }
      >
    >


  export type LocalOrderItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    itemId?: boolean
    itemName?: boolean
    variationId?: boolean
    variationName?: boolean
    kotId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    lineTotal?: boolean
    status?: boolean
    note?: boolean
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
    kot?: boolean | LocalOrderItem$kotArgs<ExtArgs>
  }, ExtArgs["result"]["localOrderItem"]>

  export type LocalOrderItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    itemId?: boolean
    itemName?: boolean
    variationId?: boolean
    variationName?: boolean
    kotId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    lineTotal?: boolean
    status?: boolean
    note?: boolean
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
    kot?: boolean | LocalOrderItem$kotArgs<ExtArgs>
  }, ExtArgs["result"]["localOrderItem"]>

  export type LocalOrderItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    itemId?: boolean
    itemName?: boolean
    variationId?: boolean
    variationName?: boolean
    kotId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    lineTotal?: boolean
    status?: boolean
    note?: boolean
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
    kot?: boolean | LocalOrderItem$kotArgs<ExtArgs>
  }, ExtArgs["result"]["localOrderItem"]>

  export type LocalOrderItemSelectScalar = {
    id?: boolean
    orderId?: boolean
    itemId?: boolean
    itemName?: boolean
    variationId?: boolean
    variationName?: boolean
    kotId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    lineTotal?: boolean
    status?: boolean
    note?: boolean
  }

  export type LocalOrderItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "itemId" | "itemName" | "variationId" | "variationName" | "kotId" | "quantity" | "unitPrice" | "lineTotal" | "status" | "note", ExtArgs["result"]["localOrderItem"]>
  export type LocalOrderItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
    kot?: boolean | LocalOrderItem$kotArgs<ExtArgs>
  }
  export type LocalOrderItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
    kot?: boolean | LocalOrderItem$kotArgs<ExtArgs>
  }
  export type LocalOrderItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
    kot?: boolean | LocalOrderItem$kotArgs<ExtArgs>
  }

  export type $LocalOrderItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalOrderItem"
    objects: {
      order: Prisma.$LocalOrderPayload<ExtArgs>
      kot: Prisma.$LocalKOTPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      itemId: string
      itemName: string
      variationId: string | null
      variationName: string | null
      kotId: string | null
      quantity: number
      unitPrice: number
      lineTotal: number
      status: string
      note: string | null
    }, ExtArgs["result"]["localOrderItem"]>
    composites: {}
  }

  type LocalOrderItemGetPayload<S extends boolean | null | undefined | LocalOrderItemDefaultArgs> = $Result.GetResult<Prisma.$LocalOrderItemPayload, S>

  type LocalOrderItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalOrderItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalOrderItemCountAggregateInputType | true
    }

  export interface LocalOrderItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalOrderItem'], meta: { name: 'LocalOrderItem' } }
    /**
     * Find zero or one LocalOrderItem that matches the filter.
     * @param {LocalOrderItemFindUniqueArgs} args - Arguments to find a LocalOrderItem
     * @example
     * // Get one LocalOrderItem
     * const localOrderItem = await prisma.localOrderItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalOrderItemFindUniqueArgs>(args: SelectSubset<T, LocalOrderItemFindUniqueArgs<ExtArgs>>): Prisma__LocalOrderItemClient<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalOrderItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalOrderItemFindUniqueOrThrowArgs} args - Arguments to find a LocalOrderItem
     * @example
     * // Get one LocalOrderItem
     * const localOrderItem = await prisma.localOrderItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalOrderItemFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalOrderItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalOrderItemClient<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalOrderItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderItemFindFirstArgs} args - Arguments to find a LocalOrderItem
     * @example
     * // Get one LocalOrderItem
     * const localOrderItem = await prisma.localOrderItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalOrderItemFindFirstArgs>(args?: SelectSubset<T, LocalOrderItemFindFirstArgs<ExtArgs>>): Prisma__LocalOrderItemClient<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalOrderItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderItemFindFirstOrThrowArgs} args - Arguments to find a LocalOrderItem
     * @example
     * // Get one LocalOrderItem
     * const localOrderItem = await prisma.localOrderItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalOrderItemFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalOrderItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalOrderItemClient<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalOrderItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalOrderItems
     * const localOrderItems = await prisma.localOrderItem.findMany()
     * 
     * // Get first 10 LocalOrderItems
     * const localOrderItems = await prisma.localOrderItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localOrderItemWithIdOnly = await prisma.localOrderItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalOrderItemFindManyArgs>(args?: SelectSubset<T, LocalOrderItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalOrderItem.
     * @param {LocalOrderItemCreateArgs} args - Arguments to create a LocalOrderItem.
     * @example
     * // Create one LocalOrderItem
     * const LocalOrderItem = await prisma.localOrderItem.create({
     *   data: {
     *     // ... data to create a LocalOrderItem
     *   }
     * })
     * 
     */
    create<T extends LocalOrderItemCreateArgs>(args: SelectSubset<T, LocalOrderItemCreateArgs<ExtArgs>>): Prisma__LocalOrderItemClient<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalOrderItems.
     * @param {LocalOrderItemCreateManyArgs} args - Arguments to create many LocalOrderItems.
     * @example
     * // Create many LocalOrderItems
     * const localOrderItem = await prisma.localOrderItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalOrderItemCreateManyArgs>(args?: SelectSubset<T, LocalOrderItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalOrderItems and returns the data saved in the database.
     * @param {LocalOrderItemCreateManyAndReturnArgs} args - Arguments to create many LocalOrderItems.
     * @example
     * // Create many LocalOrderItems
     * const localOrderItem = await prisma.localOrderItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalOrderItems and only return the `id`
     * const localOrderItemWithIdOnly = await prisma.localOrderItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalOrderItemCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalOrderItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalOrderItem.
     * @param {LocalOrderItemDeleteArgs} args - Arguments to delete one LocalOrderItem.
     * @example
     * // Delete one LocalOrderItem
     * const LocalOrderItem = await prisma.localOrderItem.delete({
     *   where: {
     *     // ... filter to delete one LocalOrderItem
     *   }
     * })
     * 
     */
    delete<T extends LocalOrderItemDeleteArgs>(args: SelectSubset<T, LocalOrderItemDeleteArgs<ExtArgs>>): Prisma__LocalOrderItemClient<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalOrderItem.
     * @param {LocalOrderItemUpdateArgs} args - Arguments to update one LocalOrderItem.
     * @example
     * // Update one LocalOrderItem
     * const localOrderItem = await prisma.localOrderItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalOrderItemUpdateArgs>(args: SelectSubset<T, LocalOrderItemUpdateArgs<ExtArgs>>): Prisma__LocalOrderItemClient<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalOrderItems.
     * @param {LocalOrderItemDeleteManyArgs} args - Arguments to filter LocalOrderItems to delete.
     * @example
     * // Delete a few LocalOrderItems
     * const { count } = await prisma.localOrderItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalOrderItemDeleteManyArgs>(args?: SelectSubset<T, LocalOrderItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalOrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalOrderItems
     * const localOrderItem = await prisma.localOrderItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalOrderItemUpdateManyArgs>(args: SelectSubset<T, LocalOrderItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalOrderItems and returns the data updated in the database.
     * @param {LocalOrderItemUpdateManyAndReturnArgs} args - Arguments to update many LocalOrderItems.
     * @example
     * // Update many LocalOrderItems
     * const localOrderItem = await prisma.localOrderItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalOrderItems and only return the `id`
     * const localOrderItemWithIdOnly = await prisma.localOrderItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalOrderItemUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalOrderItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalOrderItem.
     * @param {LocalOrderItemUpsertArgs} args - Arguments to update or create a LocalOrderItem.
     * @example
     * // Update or create a LocalOrderItem
     * const localOrderItem = await prisma.localOrderItem.upsert({
     *   create: {
     *     // ... data to create a LocalOrderItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalOrderItem we want to update
     *   }
     * })
     */
    upsert<T extends LocalOrderItemUpsertArgs>(args: SelectSubset<T, LocalOrderItemUpsertArgs<ExtArgs>>): Prisma__LocalOrderItemClient<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalOrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderItemCountArgs} args - Arguments to filter LocalOrderItems to count.
     * @example
     * // Count the number of LocalOrderItems
     * const count = await prisma.localOrderItem.count({
     *   where: {
     *     // ... the filter for the LocalOrderItems we want to count
     *   }
     * })
    **/
    count<T extends LocalOrderItemCountArgs>(
      args?: Subset<T, LocalOrderItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalOrderItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalOrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalOrderItemAggregateArgs>(args: Subset<T, LocalOrderItemAggregateArgs>): Prisma.PrismaPromise<GetLocalOrderItemAggregateType<T>>

    /**
     * Group by LocalOrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalOrderItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalOrderItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalOrderItemGroupByArgs['orderBy'] }
        : { orderBy?: LocalOrderItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalOrderItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalOrderItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalOrderItem model
   */
  readonly fields: LocalOrderItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalOrderItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalOrderItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends LocalOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocalOrderDefaultArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    kot<T extends LocalOrderItem$kotArgs<ExtArgs> = {}>(args?: Subset<T, LocalOrderItem$kotArgs<ExtArgs>>): Prisma__LocalKOTClient<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalOrderItem model
   */
  interface LocalOrderItemFieldRefs {
    readonly id: FieldRef<"LocalOrderItem", 'String'>
    readonly orderId: FieldRef<"LocalOrderItem", 'String'>
    readonly itemId: FieldRef<"LocalOrderItem", 'String'>
    readonly itemName: FieldRef<"LocalOrderItem", 'String'>
    readonly variationId: FieldRef<"LocalOrderItem", 'String'>
    readonly variationName: FieldRef<"LocalOrderItem", 'String'>
    readonly kotId: FieldRef<"LocalOrderItem", 'String'>
    readonly quantity: FieldRef<"LocalOrderItem", 'Int'>
    readonly unitPrice: FieldRef<"LocalOrderItem", 'Float'>
    readonly lineTotal: FieldRef<"LocalOrderItem", 'Float'>
    readonly status: FieldRef<"LocalOrderItem", 'String'>
    readonly note: FieldRef<"LocalOrderItem", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LocalOrderItem findUnique
   */
  export type LocalOrderItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which LocalOrderItem to fetch.
     */
    where: LocalOrderItemWhereUniqueInput
  }

  /**
   * LocalOrderItem findUniqueOrThrow
   */
  export type LocalOrderItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which LocalOrderItem to fetch.
     */
    where: LocalOrderItemWhereUniqueInput
  }

  /**
   * LocalOrderItem findFirst
   */
  export type LocalOrderItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which LocalOrderItem to fetch.
     */
    where?: LocalOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrderItems to fetch.
     */
    orderBy?: LocalOrderItemOrderByWithRelationInput | LocalOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalOrderItems.
     */
    cursor?: LocalOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalOrderItems.
     */
    distinct?: LocalOrderItemScalarFieldEnum | LocalOrderItemScalarFieldEnum[]
  }

  /**
   * LocalOrderItem findFirstOrThrow
   */
  export type LocalOrderItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which LocalOrderItem to fetch.
     */
    where?: LocalOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrderItems to fetch.
     */
    orderBy?: LocalOrderItemOrderByWithRelationInput | LocalOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalOrderItems.
     */
    cursor?: LocalOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalOrderItems.
     */
    distinct?: LocalOrderItemScalarFieldEnum | LocalOrderItemScalarFieldEnum[]
  }

  /**
   * LocalOrderItem findMany
   */
  export type LocalOrderItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which LocalOrderItems to fetch.
     */
    where?: LocalOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalOrderItems to fetch.
     */
    orderBy?: LocalOrderItemOrderByWithRelationInput | LocalOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalOrderItems.
     */
    cursor?: LocalOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalOrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalOrderItems.
     */
    distinct?: LocalOrderItemScalarFieldEnum | LocalOrderItemScalarFieldEnum[]
  }

  /**
   * LocalOrderItem create
   */
  export type LocalOrderItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
    /**
     * The data needed to create a LocalOrderItem.
     */
    data: XOR<LocalOrderItemCreateInput, LocalOrderItemUncheckedCreateInput>
  }

  /**
   * LocalOrderItem createMany
   */
  export type LocalOrderItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalOrderItems.
     */
    data: LocalOrderItemCreateManyInput | LocalOrderItemCreateManyInput[]
  }

  /**
   * LocalOrderItem createManyAndReturn
   */
  export type LocalOrderItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * The data used to create many LocalOrderItems.
     */
    data: LocalOrderItemCreateManyInput | LocalOrderItemCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocalOrderItem update
   */
  export type LocalOrderItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
    /**
     * The data needed to update a LocalOrderItem.
     */
    data: XOR<LocalOrderItemUpdateInput, LocalOrderItemUncheckedUpdateInput>
    /**
     * Choose, which LocalOrderItem to update.
     */
    where: LocalOrderItemWhereUniqueInput
  }

  /**
   * LocalOrderItem updateMany
   */
  export type LocalOrderItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalOrderItems.
     */
    data: XOR<LocalOrderItemUpdateManyMutationInput, LocalOrderItemUncheckedUpdateManyInput>
    /**
     * Filter which LocalOrderItems to update
     */
    where?: LocalOrderItemWhereInput
    /**
     * Limit how many LocalOrderItems to update.
     */
    limit?: number
  }

  /**
   * LocalOrderItem updateManyAndReturn
   */
  export type LocalOrderItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * The data used to update LocalOrderItems.
     */
    data: XOR<LocalOrderItemUpdateManyMutationInput, LocalOrderItemUncheckedUpdateManyInput>
    /**
     * Filter which LocalOrderItems to update
     */
    where?: LocalOrderItemWhereInput
    /**
     * Limit how many LocalOrderItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocalOrderItem upsert
   */
  export type LocalOrderItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
    /**
     * The filter to search for the LocalOrderItem to update in case it exists.
     */
    where: LocalOrderItemWhereUniqueInput
    /**
     * In case the LocalOrderItem found by the `where` argument doesn't exist, create a new LocalOrderItem with this data.
     */
    create: XOR<LocalOrderItemCreateInput, LocalOrderItemUncheckedCreateInput>
    /**
     * In case the LocalOrderItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalOrderItemUpdateInput, LocalOrderItemUncheckedUpdateInput>
  }

  /**
   * LocalOrderItem delete
   */
  export type LocalOrderItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
    /**
     * Filter which LocalOrderItem to delete.
     */
    where: LocalOrderItemWhereUniqueInput
  }

  /**
   * LocalOrderItem deleteMany
   */
  export type LocalOrderItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalOrderItems to delete
     */
    where?: LocalOrderItemWhereInput
    /**
     * Limit how many LocalOrderItems to delete.
     */
    limit?: number
  }

  /**
   * LocalOrderItem.kot
   */
  export type LocalOrderItem$kotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
    where?: LocalKOTWhereInput
  }

  /**
   * LocalOrderItem without action
   */
  export type LocalOrderItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
  }


  /**
   * Model LocalKOT
   */

  export type AggregateLocalKOT = {
    _count: LocalKOTCountAggregateOutputType | null
    _avg: LocalKOTAvgAggregateOutputType | null
    _sum: LocalKOTSumAggregateOutputType | null
    _min: LocalKOTMinAggregateOutputType | null
    _max: LocalKOTMaxAggregateOutputType | null
  }

  export type LocalKOTAvgAggregateOutputType = {
    kotNumber: number | null
  }

  export type LocalKOTSumAggregateOutputType = {
    kotNumber: number | null
  }

  export type LocalKOTMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    kotNumber: number | null
    sentAt: Date | null
    sentBy: string | null
  }

  export type LocalKOTMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    kotNumber: number | null
    sentAt: Date | null
    sentBy: string | null
  }

  export type LocalKOTCountAggregateOutputType = {
    id: number
    orderId: number
    kotNumber: number
    sentAt: number
    sentBy: number
    _all: number
  }


  export type LocalKOTAvgAggregateInputType = {
    kotNumber?: true
  }

  export type LocalKOTSumAggregateInputType = {
    kotNumber?: true
  }

  export type LocalKOTMinAggregateInputType = {
    id?: true
    orderId?: true
    kotNumber?: true
    sentAt?: true
    sentBy?: true
  }

  export type LocalKOTMaxAggregateInputType = {
    id?: true
    orderId?: true
    kotNumber?: true
    sentAt?: true
    sentBy?: true
  }

  export type LocalKOTCountAggregateInputType = {
    id?: true
    orderId?: true
    kotNumber?: true
    sentAt?: true
    sentBy?: true
    _all?: true
  }

  export type LocalKOTAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalKOT to aggregate.
     */
    where?: LocalKOTWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalKOTS to fetch.
     */
    orderBy?: LocalKOTOrderByWithRelationInput | LocalKOTOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalKOTWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalKOTS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalKOTS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalKOTS
    **/
    _count?: true | LocalKOTCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalKOTAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalKOTSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalKOTMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalKOTMaxAggregateInputType
  }

  export type GetLocalKOTAggregateType<T extends LocalKOTAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalKOT]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalKOT[P]>
      : GetScalarType<T[P], AggregateLocalKOT[P]>
  }




  export type LocalKOTGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalKOTWhereInput
    orderBy?: LocalKOTOrderByWithAggregationInput | LocalKOTOrderByWithAggregationInput[]
    by: LocalKOTScalarFieldEnum[] | LocalKOTScalarFieldEnum
    having?: LocalKOTScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalKOTCountAggregateInputType | true
    _avg?: LocalKOTAvgAggregateInputType
    _sum?: LocalKOTSumAggregateInputType
    _min?: LocalKOTMinAggregateInputType
    _max?: LocalKOTMaxAggregateInputType
  }

  export type LocalKOTGroupByOutputType = {
    id: string
    orderId: string
    kotNumber: number
    sentAt: Date
    sentBy: string
    _count: LocalKOTCountAggregateOutputType | null
    _avg: LocalKOTAvgAggregateOutputType | null
    _sum: LocalKOTSumAggregateOutputType | null
    _min: LocalKOTMinAggregateOutputType | null
    _max: LocalKOTMaxAggregateOutputType | null
  }

  type GetLocalKOTGroupByPayload<T extends LocalKOTGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalKOTGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalKOTGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalKOTGroupByOutputType[P]>
            : GetScalarType<T[P], LocalKOTGroupByOutputType[P]>
        }
      >
    >


  export type LocalKOTSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    kotNumber?: boolean
    sentAt?: boolean
    sentBy?: boolean
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
    items?: boolean | LocalKOT$itemsArgs<ExtArgs>
    _count?: boolean | LocalKOTCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["localKOT"]>

  export type LocalKOTSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    kotNumber?: boolean
    sentAt?: boolean
    sentBy?: boolean
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["localKOT"]>

  export type LocalKOTSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    kotNumber?: boolean
    sentAt?: boolean
    sentBy?: boolean
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["localKOT"]>

  export type LocalKOTSelectScalar = {
    id?: boolean
    orderId?: boolean
    kotNumber?: boolean
    sentAt?: boolean
    sentBy?: boolean
  }

  export type LocalKOTOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "kotNumber" | "sentAt" | "sentBy", ExtArgs["result"]["localKOT"]>
  export type LocalKOTInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
    items?: boolean | LocalKOT$itemsArgs<ExtArgs>
    _count?: boolean | LocalKOTCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LocalKOTIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
  }
  export type LocalKOTIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
  }

  export type $LocalKOTPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalKOT"
    objects: {
      order: Prisma.$LocalOrderPayload<ExtArgs>
      items: Prisma.$LocalOrderItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      kotNumber: number
      sentAt: Date
      sentBy: string
    }, ExtArgs["result"]["localKOT"]>
    composites: {}
  }

  type LocalKOTGetPayload<S extends boolean | null | undefined | LocalKOTDefaultArgs> = $Result.GetResult<Prisma.$LocalKOTPayload, S>

  type LocalKOTCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalKOTFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalKOTCountAggregateInputType | true
    }

  export interface LocalKOTDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalKOT'], meta: { name: 'LocalKOT' } }
    /**
     * Find zero or one LocalKOT that matches the filter.
     * @param {LocalKOTFindUniqueArgs} args - Arguments to find a LocalKOT
     * @example
     * // Get one LocalKOT
     * const localKOT = await prisma.localKOT.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalKOTFindUniqueArgs>(args: SelectSubset<T, LocalKOTFindUniqueArgs<ExtArgs>>): Prisma__LocalKOTClient<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalKOT that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalKOTFindUniqueOrThrowArgs} args - Arguments to find a LocalKOT
     * @example
     * // Get one LocalKOT
     * const localKOT = await prisma.localKOT.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalKOTFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalKOTFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalKOTClient<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalKOT that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalKOTFindFirstArgs} args - Arguments to find a LocalKOT
     * @example
     * // Get one LocalKOT
     * const localKOT = await prisma.localKOT.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalKOTFindFirstArgs>(args?: SelectSubset<T, LocalKOTFindFirstArgs<ExtArgs>>): Prisma__LocalKOTClient<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalKOT that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalKOTFindFirstOrThrowArgs} args - Arguments to find a LocalKOT
     * @example
     * // Get one LocalKOT
     * const localKOT = await prisma.localKOT.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalKOTFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalKOTFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalKOTClient<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalKOTS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalKOTFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalKOTS
     * const localKOTS = await prisma.localKOT.findMany()
     * 
     * // Get first 10 LocalKOTS
     * const localKOTS = await prisma.localKOT.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localKOTWithIdOnly = await prisma.localKOT.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalKOTFindManyArgs>(args?: SelectSubset<T, LocalKOTFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalKOT.
     * @param {LocalKOTCreateArgs} args - Arguments to create a LocalKOT.
     * @example
     * // Create one LocalKOT
     * const LocalKOT = await prisma.localKOT.create({
     *   data: {
     *     // ... data to create a LocalKOT
     *   }
     * })
     * 
     */
    create<T extends LocalKOTCreateArgs>(args: SelectSubset<T, LocalKOTCreateArgs<ExtArgs>>): Prisma__LocalKOTClient<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalKOTS.
     * @param {LocalKOTCreateManyArgs} args - Arguments to create many LocalKOTS.
     * @example
     * // Create many LocalKOTS
     * const localKOT = await prisma.localKOT.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalKOTCreateManyArgs>(args?: SelectSubset<T, LocalKOTCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalKOTS and returns the data saved in the database.
     * @param {LocalKOTCreateManyAndReturnArgs} args - Arguments to create many LocalKOTS.
     * @example
     * // Create many LocalKOTS
     * const localKOT = await prisma.localKOT.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalKOTS and only return the `id`
     * const localKOTWithIdOnly = await prisma.localKOT.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalKOTCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalKOTCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalKOT.
     * @param {LocalKOTDeleteArgs} args - Arguments to delete one LocalKOT.
     * @example
     * // Delete one LocalKOT
     * const LocalKOT = await prisma.localKOT.delete({
     *   where: {
     *     // ... filter to delete one LocalKOT
     *   }
     * })
     * 
     */
    delete<T extends LocalKOTDeleteArgs>(args: SelectSubset<T, LocalKOTDeleteArgs<ExtArgs>>): Prisma__LocalKOTClient<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalKOT.
     * @param {LocalKOTUpdateArgs} args - Arguments to update one LocalKOT.
     * @example
     * // Update one LocalKOT
     * const localKOT = await prisma.localKOT.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalKOTUpdateArgs>(args: SelectSubset<T, LocalKOTUpdateArgs<ExtArgs>>): Prisma__LocalKOTClient<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalKOTS.
     * @param {LocalKOTDeleteManyArgs} args - Arguments to filter LocalKOTS to delete.
     * @example
     * // Delete a few LocalKOTS
     * const { count } = await prisma.localKOT.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalKOTDeleteManyArgs>(args?: SelectSubset<T, LocalKOTDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalKOTS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalKOTUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalKOTS
     * const localKOT = await prisma.localKOT.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalKOTUpdateManyArgs>(args: SelectSubset<T, LocalKOTUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalKOTS and returns the data updated in the database.
     * @param {LocalKOTUpdateManyAndReturnArgs} args - Arguments to update many LocalKOTS.
     * @example
     * // Update many LocalKOTS
     * const localKOT = await prisma.localKOT.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalKOTS and only return the `id`
     * const localKOTWithIdOnly = await prisma.localKOT.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalKOTUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalKOTUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalKOT.
     * @param {LocalKOTUpsertArgs} args - Arguments to update or create a LocalKOT.
     * @example
     * // Update or create a LocalKOT
     * const localKOT = await prisma.localKOT.upsert({
     *   create: {
     *     // ... data to create a LocalKOT
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalKOT we want to update
     *   }
     * })
     */
    upsert<T extends LocalKOTUpsertArgs>(args: SelectSubset<T, LocalKOTUpsertArgs<ExtArgs>>): Prisma__LocalKOTClient<$Result.GetResult<Prisma.$LocalKOTPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalKOTS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalKOTCountArgs} args - Arguments to filter LocalKOTS to count.
     * @example
     * // Count the number of LocalKOTS
     * const count = await prisma.localKOT.count({
     *   where: {
     *     // ... the filter for the LocalKOTS we want to count
     *   }
     * })
    **/
    count<T extends LocalKOTCountArgs>(
      args?: Subset<T, LocalKOTCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalKOTCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalKOT.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalKOTAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalKOTAggregateArgs>(args: Subset<T, LocalKOTAggregateArgs>): Prisma.PrismaPromise<GetLocalKOTAggregateType<T>>

    /**
     * Group by LocalKOT.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalKOTGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalKOTGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalKOTGroupByArgs['orderBy'] }
        : { orderBy?: LocalKOTGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalKOTGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalKOTGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalKOT model
   */
  readonly fields: LocalKOTFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalKOT.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalKOTClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends LocalOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocalOrderDefaultArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    items<T extends LocalKOT$itemsArgs<ExtArgs> = {}>(args?: Subset<T, LocalKOT$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalOrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalKOT model
   */
  interface LocalKOTFieldRefs {
    readonly id: FieldRef<"LocalKOT", 'String'>
    readonly orderId: FieldRef<"LocalKOT", 'String'>
    readonly kotNumber: FieldRef<"LocalKOT", 'Int'>
    readonly sentAt: FieldRef<"LocalKOT", 'DateTime'>
    readonly sentBy: FieldRef<"LocalKOT", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LocalKOT findUnique
   */
  export type LocalKOTFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
    /**
     * Filter, which LocalKOT to fetch.
     */
    where: LocalKOTWhereUniqueInput
  }

  /**
   * LocalKOT findUniqueOrThrow
   */
  export type LocalKOTFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
    /**
     * Filter, which LocalKOT to fetch.
     */
    where: LocalKOTWhereUniqueInput
  }

  /**
   * LocalKOT findFirst
   */
  export type LocalKOTFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
    /**
     * Filter, which LocalKOT to fetch.
     */
    where?: LocalKOTWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalKOTS to fetch.
     */
    orderBy?: LocalKOTOrderByWithRelationInput | LocalKOTOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalKOTS.
     */
    cursor?: LocalKOTWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalKOTS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalKOTS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalKOTS.
     */
    distinct?: LocalKOTScalarFieldEnum | LocalKOTScalarFieldEnum[]
  }

  /**
   * LocalKOT findFirstOrThrow
   */
  export type LocalKOTFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
    /**
     * Filter, which LocalKOT to fetch.
     */
    where?: LocalKOTWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalKOTS to fetch.
     */
    orderBy?: LocalKOTOrderByWithRelationInput | LocalKOTOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalKOTS.
     */
    cursor?: LocalKOTWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalKOTS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalKOTS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalKOTS.
     */
    distinct?: LocalKOTScalarFieldEnum | LocalKOTScalarFieldEnum[]
  }

  /**
   * LocalKOT findMany
   */
  export type LocalKOTFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
    /**
     * Filter, which LocalKOTS to fetch.
     */
    where?: LocalKOTWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalKOTS to fetch.
     */
    orderBy?: LocalKOTOrderByWithRelationInput | LocalKOTOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalKOTS.
     */
    cursor?: LocalKOTWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalKOTS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalKOTS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalKOTS.
     */
    distinct?: LocalKOTScalarFieldEnum | LocalKOTScalarFieldEnum[]
  }

  /**
   * LocalKOT create
   */
  export type LocalKOTCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
    /**
     * The data needed to create a LocalKOT.
     */
    data: XOR<LocalKOTCreateInput, LocalKOTUncheckedCreateInput>
  }

  /**
   * LocalKOT createMany
   */
  export type LocalKOTCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalKOTS.
     */
    data: LocalKOTCreateManyInput | LocalKOTCreateManyInput[]
  }

  /**
   * LocalKOT createManyAndReturn
   */
  export type LocalKOTCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * The data used to create many LocalKOTS.
     */
    data: LocalKOTCreateManyInput | LocalKOTCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocalKOT update
   */
  export type LocalKOTUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
    /**
     * The data needed to update a LocalKOT.
     */
    data: XOR<LocalKOTUpdateInput, LocalKOTUncheckedUpdateInput>
    /**
     * Choose, which LocalKOT to update.
     */
    where: LocalKOTWhereUniqueInput
  }

  /**
   * LocalKOT updateMany
   */
  export type LocalKOTUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalKOTS.
     */
    data: XOR<LocalKOTUpdateManyMutationInput, LocalKOTUncheckedUpdateManyInput>
    /**
     * Filter which LocalKOTS to update
     */
    where?: LocalKOTWhereInput
    /**
     * Limit how many LocalKOTS to update.
     */
    limit?: number
  }

  /**
   * LocalKOT updateManyAndReturn
   */
  export type LocalKOTUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * The data used to update LocalKOTS.
     */
    data: XOR<LocalKOTUpdateManyMutationInput, LocalKOTUncheckedUpdateManyInput>
    /**
     * Filter which LocalKOTS to update
     */
    where?: LocalKOTWhereInput
    /**
     * Limit how many LocalKOTS to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocalKOT upsert
   */
  export type LocalKOTUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
    /**
     * The filter to search for the LocalKOT to update in case it exists.
     */
    where: LocalKOTWhereUniqueInput
    /**
     * In case the LocalKOT found by the `where` argument doesn't exist, create a new LocalKOT with this data.
     */
    create: XOR<LocalKOTCreateInput, LocalKOTUncheckedCreateInput>
    /**
     * In case the LocalKOT was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalKOTUpdateInput, LocalKOTUncheckedUpdateInput>
  }

  /**
   * LocalKOT delete
   */
  export type LocalKOTDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
    /**
     * Filter which LocalKOT to delete.
     */
    where: LocalKOTWhereUniqueInput
  }

  /**
   * LocalKOT deleteMany
   */
  export type LocalKOTDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalKOTS to delete
     */
    where?: LocalKOTWhereInput
    /**
     * Limit how many LocalKOTS to delete.
     */
    limit?: number
  }

  /**
   * LocalKOT.items
   */
  export type LocalKOT$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalOrderItem
     */
    select?: LocalOrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalOrderItem
     */
    omit?: LocalOrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalOrderItemInclude<ExtArgs> | null
    where?: LocalOrderItemWhereInput
    orderBy?: LocalOrderItemOrderByWithRelationInput | LocalOrderItemOrderByWithRelationInput[]
    cursor?: LocalOrderItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocalOrderItemScalarFieldEnum | LocalOrderItemScalarFieldEnum[]
  }

  /**
   * LocalKOT without action
   */
  export type LocalKOTDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalKOT
     */
    select?: LocalKOTSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalKOT
     */
    omit?: LocalKOTOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalKOTInclude<ExtArgs> | null
  }


  /**
   * Model LocalSettlement
   */

  export type AggregateLocalSettlement = {
    _count: LocalSettlementCountAggregateOutputType | null
    _avg: LocalSettlementAvgAggregateOutputType | null
    _sum: LocalSettlementSumAggregateOutputType | null
    _min: LocalSettlementMinAggregateOutputType | null
    _max: LocalSettlementMaxAggregateOutputType | null
  }

  export type LocalSettlementAvgAggregateOutputType = {
    subtotal: number | null
    taxTotal: number | null
    discountTotal: number | null
    grandTotal: number | null
    cashPaid: number | null
    cardPaid: number | null
    upiPaid: number | null
    discountValue: number | null
    changeGiven: number | null
  }

  export type LocalSettlementSumAggregateOutputType = {
    subtotal: number | null
    taxTotal: number | null
    discountTotal: number | null
    grandTotal: number | null
    cashPaid: number | null
    cardPaid: number | null
    upiPaid: number | null
    discountValue: number | null
    changeGiven: number | null
  }

  export type LocalSettlementMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    subtotal: number | null
    taxTotal: number | null
    discountTotal: number | null
    grandTotal: number | null
    cashPaid: number | null
    cardPaid: number | null
    upiPaid: number | null
    discountType: string | null
    discountValue: number | null
    discountReason: string | null
    changeGiven: number | null
    settledAt: Date | null
  }

  export type LocalSettlementMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    subtotal: number | null
    taxTotal: number | null
    discountTotal: number | null
    grandTotal: number | null
    cashPaid: number | null
    cardPaid: number | null
    upiPaid: number | null
    discountType: string | null
    discountValue: number | null
    discountReason: string | null
    changeGiven: number | null
    settledAt: Date | null
  }

  export type LocalSettlementCountAggregateOutputType = {
    id: number
    orderId: number
    subtotal: number
    taxTotal: number
    discountTotal: number
    grandTotal: number
    cashPaid: number
    cardPaid: number
    upiPaid: number
    discountType: number
    discountValue: number
    discountReason: number
    changeGiven: number
    settledAt: number
    _all: number
  }


  export type LocalSettlementAvgAggregateInputType = {
    subtotal?: true
    taxTotal?: true
    discountTotal?: true
    grandTotal?: true
    cashPaid?: true
    cardPaid?: true
    upiPaid?: true
    discountValue?: true
    changeGiven?: true
  }

  export type LocalSettlementSumAggregateInputType = {
    subtotal?: true
    taxTotal?: true
    discountTotal?: true
    grandTotal?: true
    cashPaid?: true
    cardPaid?: true
    upiPaid?: true
    discountValue?: true
    changeGiven?: true
  }

  export type LocalSettlementMinAggregateInputType = {
    id?: true
    orderId?: true
    subtotal?: true
    taxTotal?: true
    discountTotal?: true
    grandTotal?: true
    cashPaid?: true
    cardPaid?: true
    upiPaid?: true
    discountType?: true
    discountValue?: true
    discountReason?: true
    changeGiven?: true
    settledAt?: true
  }

  export type LocalSettlementMaxAggregateInputType = {
    id?: true
    orderId?: true
    subtotal?: true
    taxTotal?: true
    discountTotal?: true
    grandTotal?: true
    cashPaid?: true
    cardPaid?: true
    upiPaid?: true
    discountType?: true
    discountValue?: true
    discountReason?: true
    changeGiven?: true
    settledAt?: true
  }

  export type LocalSettlementCountAggregateInputType = {
    id?: true
    orderId?: true
    subtotal?: true
    taxTotal?: true
    discountTotal?: true
    grandTotal?: true
    cashPaid?: true
    cardPaid?: true
    upiPaid?: true
    discountType?: true
    discountValue?: true
    discountReason?: true
    changeGiven?: true
    settledAt?: true
    _all?: true
  }

  export type LocalSettlementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalSettlement to aggregate.
     */
    where?: LocalSettlementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSettlements to fetch.
     */
    orderBy?: LocalSettlementOrderByWithRelationInput | LocalSettlementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalSettlementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSettlements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSettlements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalSettlements
    **/
    _count?: true | LocalSettlementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalSettlementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalSettlementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalSettlementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalSettlementMaxAggregateInputType
  }

  export type GetLocalSettlementAggregateType<T extends LocalSettlementAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalSettlement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalSettlement[P]>
      : GetScalarType<T[P], AggregateLocalSettlement[P]>
  }




  export type LocalSettlementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalSettlementWhereInput
    orderBy?: LocalSettlementOrderByWithAggregationInput | LocalSettlementOrderByWithAggregationInput[]
    by: LocalSettlementScalarFieldEnum[] | LocalSettlementScalarFieldEnum
    having?: LocalSettlementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalSettlementCountAggregateInputType | true
    _avg?: LocalSettlementAvgAggregateInputType
    _sum?: LocalSettlementSumAggregateInputType
    _min?: LocalSettlementMinAggregateInputType
    _max?: LocalSettlementMaxAggregateInputType
  }

  export type LocalSettlementGroupByOutputType = {
    id: string
    orderId: string
    subtotal: number
    taxTotal: number
    discountTotal: number
    grandTotal: number
    cashPaid: number
    cardPaid: number
    upiPaid: number
    discountType: string | null
    discountValue: number | null
    discountReason: string | null
    changeGiven: number
    settledAt: Date
    _count: LocalSettlementCountAggregateOutputType | null
    _avg: LocalSettlementAvgAggregateOutputType | null
    _sum: LocalSettlementSumAggregateOutputType | null
    _min: LocalSettlementMinAggregateOutputType | null
    _max: LocalSettlementMaxAggregateOutputType | null
  }

  type GetLocalSettlementGroupByPayload<T extends LocalSettlementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalSettlementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalSettlementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalSettlementGroupByOutputType[P]>
            : GetScalarType<T[P], LocalSettlementGroupByOutputType[P]>
        }
      >
    >


  export type LocalSettlementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    subtotal?: boolean
    taxTotal?: boolean
    discountTotal?: boolean
    grandTotal?: boolean
    cashPaid?: boolean
    cardPaid?: boolean
    upiPaid?: boolean
    discountType?: boolean
    discountValue?: boolean
    discountReason?: boolean
    changeGiven?: boolean
    settledAt?: boolean
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["localSettlement"]>

  export type LocalSettlementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    subtotal?: boolean
    taxTotal?: boolean
    discountTotal?: boolean
    grandTotal?: boolean
    cashPaid?: boolean
    cardPaid?: boolean
    upiPaid?: boolean
    discountType?: boolean
    discountValue?: boolean
    discountReason?: boolean
    changeGiven?: boolean
    settledAt?: boolean
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["localSettlement"]>

  export type LocalSettlementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    subtotal?: boolean
    taxTotal?: boolean
    discountTotal?: boolean
    grandTotal?: boolean
    cashPaid?: boolean
    cardPaid?: boolean
    upiPaid?: boolean
    discountType?: boolean
    discountValue?: boolean
    discountReason?: boolean
    changeGiven?: boolean
    settledAt?: boolean
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["localSettlement"]>

  export type LocalSettlementSelectScalar = {
    id?: boolean
    orderId?: boolean
    subtotal?: boolean
    taxTotal?: boolean
    discountTotal?: boolean
    grandTotal?: boolean
    cashPaid?: boolean
    cardPaid?: boolean
    upiPaid?: boolean
    discountType?: boolean
    discountValue?: boolean
    discountReason?: boolean
    changeGiven?: boolean
    settledAt?: boolean
  }

  export type LocalSettlementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "subtotal" | "taxTotal" | "discountTotal" | "grandTotal" | "cashPaid" | "cardPaid" | "upiPaid" | "discountType" | "discountValue" | "discountReason" | "changeGiven" | "settledAt", ExtArgs["result"]["localSettlement"]>
  export type LocalSettlementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
  }
  export type LocalSettlementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
  }
  export type LocalSettlementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | LocalOrderDefaultArgs<ExtArgs>
  }

  export type $LocalSettlementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalSettlement"
    objects: {
      order: Prisma.$LocalOrderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      subtotal: number
      taxTotal: number
      discountTotal: number
      grandTotal: number
      cashPaid: number
      cardPaid: number
      upiPaid: number
      discountType: string | null
      discountValue: number | null
      discountReason: string | null
      changeGiven: number
      settledAt: Date
    }, ExtArgs["result"]["localSettlement"]>
    composites: {}
  }

  type LocalSettlementGetPayload<S extends boolean | null | undefined | LocalSettlementDefaultArgs> = $Result.GetResult<Prisma.$LocalSettlementPayload, S>

  type LocalSettlementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalSettlementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalSettlementCountAggregateInputType | true
    }

  export interface LocalSettlementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalSettlement'], meta: { name: 'LocalSettlement' } }
    /**
     * Find zero or one LocalSettlement that matches the filter.
     * @param {LocalSettlementFindUniqueArgs} args - Arguments to find a LocalSettlement
     * @example
     * // Get one LocalSettlement
     * const localSettlement = await prisma.localSettlement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalSettlementFindUniqueArgs>(args: SelectSubset<T, LocalSettlementFindUniqueArgs<ExtArgs>>): Prisma__LocalSettlementClient<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalSettlement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalSettlementFindUniqueOrThrowArgs} args - Arguments to find a LocalSettlement
     * @example
     * // Get one LocalSettlement
     * const localSettlement = await prisma.localSettlement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalSettlementFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalSettlementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalSettlementClient<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalSettlement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSettlementFindFirstArgs} args - Arguments to find a LocalSettlement
     * @example
     * // Get one LocalSettlement
     * const localSettlement = await prisma.localSettlement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalSettlementFindFirstArgs>(args?: SelectSubset<T, LocalSettlementFindFirstArgs<ExtArgs>>): Prisma__LocalSettlementClient<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalSettlement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSettlementFindFirstOrThrowArgs} args - Arguments to find a LocalSettlement
     * @example
     * // Get one LocalSettlement
     * const localSettlement = await prisma.localSettlement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalSettlementFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalSettlementFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalSettlementClient<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalSettlements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSettlementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalSettlements
     * const localSettlements = await prisma.localSettlement.findMany()
     * 
     * // Get first 10 LocalSettlements
     * const localSettlements = await prisma.localSettlement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localSettlementWithIdOnly = await prisma.localSettlement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalSettlementFindManyArgs>(args?: SelectSubset<T, LocalSettlementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalSettlement.
     * @param {LocalSettlementCreateArgs} args - Arguments to create a LocalSettlement.
     * @example
     * // Create one LocalSettlement
     * const LocalSettlement = await prisma.localSettlement.create({
     *   data: {
     *     // ... data to create a LocalSettlement
     *   }
     * })
     * 
     */
    create<T extends LocalSettlementCreateArgs>(args: SelectSubset<T, LocalSettlementCreateArgs<ExtArgs>>): Prisma__LocalSettlementClient<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalSettlements.
     * @param {LocalSettlementCreateManyArgs} args - Arguments to create many LocalSettlements.
     * @example
     * // Create many LocalSettlements
     * const localSettlement = await prisma.localSettlement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalSettlementCreateManyArgs>(args?: SelectSubset<T, LocalSettlementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalSettlements and returns the data saved in the database.
     * @param {LocalSettlementCreateManyAndReturnArgs} args - Arguments to create many LocalSettlements.
     * @example
     * // Create many LocalSettlements
     * const localSettlement = await prisma.localSettlement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalSettlements and only return the `id`
     * const localSettlementWithIdOnly = await prisma.localSettlement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalSettlementCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalSettlementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalSettlement.
     * @param {LocalSettlementDeleteArgs} args - Arguments to delete one LocalSettlement.
     * @example
     * // Delete one LocalSettlement
     * const LocalSettlement = await prisma.localSettlement.delete({
     *   where: {
     *     // ... filter to delete one LocalSettlement
     *   }
     * })
     * 
     */
    delete<T extends LocalSettlementDeleteArgs>(args: SelectSubset<T, LocalSettlementDeleteArgs<ExtArgs>>): Prisma__LocalSettlementClient<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalSettlement.
     * @param {LocalSettlementUpdateArgs} args - Arguments to update one LocalSettlement.
     * @example
     * // Update one LocalSettlement
     * const localSettlement = await prisma.localSettlement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalSettlementUpdateArgs>(args: SelectSubset<T, LocalSettlementUpdateArgs<ExtArgs>>): Prisma__LocalSettlementClient<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalSettlements.
     * @param {LocalSettlementDeleteManyArgs} args - Arguments to filter LocalSettlements to delete.
     * @example
     * // Delete a few LocalSettlements
     * const { count } = await prisma.localSettlement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalSettlementDeleteManyArgs>(args?: SelectSubset<T, LocalSettlementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalSettlements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSettlementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalSettlements
     * const localSettlement = await prisma.localSettlement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalSettlementUpdateManyArgs>(args: SelectSubset<T, LocalSettlementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalSettlements and returns the data updated in the database.
     * @param {LocalSettlementUpdateManyAndReturnArgs} args - Arguments to update many LocalSettlements.
     * @example
     * // Update many LocalSettlements
     * const localSettlement = await prisma.localSettlement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalSettlements and only return the `id`
     * const localSettlementWithIdOnly = await prisma.localSettlement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalSettlementUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalSettlementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalSettlement.
     * @param {LocalSettlementUpsertArgs} args - Arguments to update or create a LocalSettlement.
     * @example
     * // Update or create a LocalSettlement
     * const localSettlement = await prisma.localSettlement.upsert({
     *   create: {
     *     // ... data to create a LocalSettlement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalSettlement we want to update
     *   }
     * })
     */
    upsert<T extends LocalSettlementUpsertArgs>(args: SelectSubset<T, LocalSettlementUpsertArgs<ExtArgs>>): Prisma__LocalSettlementClient<$Result.GetResult<Prisma.$LocalSettlementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalSettlements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSettlementCountArgs} args - Arguments to filter LocalSettlements to count.
     * @example
     * // Count the number of LocalSettlements
     * const count = await prisma.localSettlement.count({
     *   where: {
     *     // ... the filter for the LocalSettlements we want to count
     *   }
     * })
    **/
    count<T extends LocalSettlementCountArgs>(
      args?: Subset<T, LocalSettlementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalSettlementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalSettlement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSettlementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalSettlementAggregateArgs>(args: Subset<T, LocalSettlementAggregateArgs>): Prisma.PrismaPromise<GetLocalSettlementAggregateType<T>>

    /**
     * Group by LocalSettlement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSettlementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalSettlementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalSettlementGroupByArgs['orderBy'] }
        : { orderBy?: LocalSettlementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalSettlementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalSettlementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalSettlement model
   */
  readonly fields: LocalSettlementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalSettlement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalSettlementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends LocalOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocalOrderDefaultArgs<ExtArgs>>): Prisma__LocalOrderClient<$Result.GetResult<Prisma.$LocalOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalSettlement model
   */
  interface LocalSettlementFieldRefs {
    readonly id: FieldRef<"LocalSettlement", 'String'>
    readonly orderId: FieldRef<"LocalSettlement", 'String'>
    readonly subtotal: FieldRef<"LocalSettlement", 'Float'>
    readonly taxTotal: FieldRef<"LocalSettlement", 'Float'>
    readonly discountTotal: FieldRef<"LocalSettlement", 'Float'>
    readonly grandTotal: FieldRef<"LocalSettlement", 'Float'>
    readonly cashPaid: FieldRef<"LocalSettlement", 'Float'>
    readonly cardPaid: FieldRef<"LocalSettlement", 'Float'>
    readonly upiPaid: FieldRef<"LocalSettlement", 'Float'>
    readonly discountType: FieldRef<"LocalSettlement", 'String'>
    readonly discountValue: FieldRef<"LocalSettlement", 'Float'>
    readonly discountReason: FieldRef<"LocalSettlement", 'String'>
    readonly changeGiven: FieldRef<"LocalSettlement", 'Float'>
    readonly settledAt: FieldRef<"LocalSettlement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocalSettlement findUnique
   */
  export type LocalSettlementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementInclude<ExtArgs> | null
    /**
     * Filter, which LocalSettlement to fetch.
     */
    where: LocalSettlementWhereUniqueInput
  }

  /**
   * LocalSettlement findUniqueOrThrow
   */
  export type LocalSettlementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementInclude<ExtArgs> | null
    /**
     * Filter, which LocalSettlement to fetch.
     */
    where: LocalSettlementWhereUniqueInput
  }

  /**
   * LocalSettlement findFirst
   */
  export type LocalSettlementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementInclude<ExtArgs> | null
    /**
     * Filter, which LocalSettlement to fetch.
     */
    where?: LocalSettlementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSettlements to fetch.
     */
    orderBy?: LocalSettlementOrderByWithRelationInput | LocalSettlementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalSettlements.
     */
    cursor?: LocalSettlementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSettlements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSettlements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalSettlements.
     */
    distinct?: LocalSettlementScalarFieldEnum | LocalSettlementScalarFieldEnum[]
  }

  /**
   * LocalSettlement findFirstOrThrow
   */
  export type LocalSettlementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementInclude<ExtArgs> | null
    /**
     * Filter, which LocalSettlement to fetch.
     */
    where?: LocalSettlementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSettlements to fetch.
     */
    orderBy?: LocalSettlementOrderByWithRelationInput | LocalSettlementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalSettlements.
     */
    cursor?: LocalSettlementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSettlements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSettlements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalSettlements.
     */
    distinct?: LocalSettlementScalarFieldEnum | LocalSettlementScalarFieldEnum[]
  }

  /**
   * LocalSettlement findMany
   */
  export type LocalSettlementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementInclude<ExtArgs> | null
    /**
     * Filter, which LocalSettlements to fetch.
     */
    where?: LocalSettlementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSettlements to fetch.
     */
    orderBy?: LocalSettlementOrderByWithRelationInput | LocalSettlementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalSettlements.
     */
    cursor?: LocalSettlementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSettlements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSettlements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalSettlements.
     */
    distinct?: LocalSettlementScalarFieldEnum | LocalSettlementScalarFieldEnum[]
  }

  /**
   * LocalSettlement create
   */
  export type LocalSettlementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementInclude<ExtArgs> | null
    /**
     * The data needed to create a LocalSettlement.
     */
    data: XOR<LocalSettlementCreateInput, LocalSettlementUncheckedCreateInput>
  }

  /**
   * LocalSettlement createMany
   */
  export type LocalSettlementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalSettlements.
     */
    data: LocalSettlementCreateManyInput | LocalSettlementCreateManyInput[]
  }

  /**
   * LocalSettlement createManyAndReturn
   */
  export type LocalSettlementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * The data used to create many LocalSettlements.
     */
    data: LocalSettlementCreateManyInput | LocalSettlementCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocalSettlement update
   */
  export type LocalSettlementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementInclude<ExtArgs> | null
    /**
     * The data needed to update a LocalSettlement.
     */
    data: XOR<LocalSettlementUpdateInput, LocalSettlementUncheckedUpdateInput>
    /**
     * Choose, which LocalSettlement to update.
     */
    where: LocalSettlementWhereUniqueInput
  }

  /**
   * LocalSettlement updateMany
   */
  export type LocalSettlementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalSettlements.
     */
    data: XOR<LocalSettlementUpdateManyMutationInput, LocalSettlementUncheckedUpdateManyInput>
    /**
     * Filter which LocalSettlements to update
     */
    where?: LocalSettlementWhereInput
    /**
     * Limit how many LocalSettlements to update.
     */
    limit?: number
  }

  /**
   * LocalSettlement updateManyAndReturn
   */
  export type LocalSettlementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * The data used to update LocalSettlements.
     */
    data: XOR<LocalSettlementUpdateManyMutationInput, LocalSettlementUncheckedUpdateManyInput>
    /**
     * Filter which LocalSettlements to update
     */
    where?: LocalSettlementWhereInput
    /**
     * Limit how many LocalSettlements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocalSettlement upsert
   */
  export type LocalSettlementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementInclude<ExtArgs> | null
    /**
     * The filter to search for the LocalSettlement to update in case it exists.
     */
    where: LocalSettlementWhereUniqueInput
    /**
     * In case the LocalSettlement found by the `where` argument doesn't exist, create a new LocalSettlement with this data.
     */
    create: XOR<LocalSettlementCreateInput, LocalSettlementUncheckedCreateInput>
    /**
     * In case the LocalSettlement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalSettlementUpdateInput, LocalSettlementUncheckedUpdateInput>
  }

  /**
   * LocalSettlement delete
   */
  export type LocalSettlementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementInclude<ExtArgs> | null
    /**
     * Filter which LocalSettlement to delete.
     */
    where: LocalSettlementWhereUniqueInput
  }

  /**
   * LocalSettlement deleteMany
   */
  export type LocalSettlementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalSettlements to delete
     */
    where?: LocalSettlementWhereInput
    /**
     * Limit how many LocalSettlements to delete.
     */
    limit?: number
  }

  /**
   * LocalSettlement without action
   */
  export type LocalSettlementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSettlement
     */
    select?: LocalSettlementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSettlement
     */
    omit?: LocalSettlementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSettlementInclude<ExtArgs> | null
  }


  /**
   * Model SyncQueue
   */

  export type AggregateSyncQueue = {
    _count: SyncQueueCountAggregateOutputType | null
    _avg: SyncQueueAvgAggregateOutputType | null
    _sum: SyncQueueSumAggregateOutputType | null
    _min: SyncQueueMinAggregateOutputType | null
    _max: SyncQueueMaxAggregateOutputType | null
  }

  export type SyncQueueAvgAggregateOutputType = {
    retryCount: number | null
  }

  export type SyncQueueSumAggregateOutputType = {
    retryCount: number | null
  }

  export type SyncQueueMinAggregateOutputType = {
    id: string | null
    action: string | null
    payload: string | null
    status: string | null
    retryCount: number | null
    retryAt: Date | null
    error: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SyncQueueMaxAggregateOutputType = {
    id: string | null
    action: string | null
    payload: string | null
    status: string | null
    retryCount: number | null
    retryAt: Date | null
    error: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SyncQueueCountAggregateOutputType = {
    id: number
    action: number
    payload: number
    status: number
    retryCount: number
    retryAt: number
    error: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SyncQueueAvgAggregateInputType = {
    retryCount?: true
  }

  export type SyncQueueSumAggregateInputType = {
    retryCount?: true
  }

  export type SyncQueueMinAggregateInputType = {
    id?: true
    action?: true
    payload?: true
    status?: true
    retryCount?: true
    retryAt?: true
    error?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SyncQueueMaxAggregateInputType = {
    id?: true
    action?: true
    payload?: true
    status?: true
    retryCount?: true
    retryAt?: true
    error?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SyncQueueCountAggregateInputType = {
    id?: true
    action?: true
    payload?: true
    status?: true
    retryCount?: true
    retryAt?: true
    error?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SyncQueueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncQueue to aggregate.
     */
    where?: SyncQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueues to fetch.
     */
    orderBy?: SyncQueueOrderByWithRelationInput | SyncQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SyncQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SyncQueues
    **/
    _count?: true | SyncQueueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SyncQueueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SyncQueueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SyncQueueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SyncQueueMaxAggregateInputType
  }

  export type GetSyncQueueAggregateType<T extends SyncQueueAggregateArgs> = {
        [P in keyof T & keyof AggregateSyncQueue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSyncQueue[P]>
      : GetScalarType<T[P], AggregateSyncQueue[P]>
  }




  export type SyncQueueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SyncQueueWhereInput
    orderBy?: SyncQueueOrderByWithAggregationInput | SyncQueueOrderByWithAggregationInput[]
    by: SyncQueueScalarFieldEnum[] | SyncQueueScalarFieldEnum
    having?: SyncQueueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SyncQueueCountAggregateInputType | true
    _avg?: SyncQueueAvgAggregateInputType
    _sum?: SyncQueueSumAggregateInputType
    _min?: SyncQueueMinAggregateInputType
    _max?: SyncQueueMaxAggregateInputType
  }

  export type SyncQueueGroupByOutputType = {
    id: string
    action: string
    payload: string
    status: string
    retryCount: number
    retryAt: Date | null
    error: string | null
    createdAt: Date
    updatedAt: Date
    _count: SyncQueueCountAggregateOutputType | null
    _avg: SyncQueueAvgAggregateOutputType | null
    _sum: SyncQueueSumAggregateOutputType | null
    _min: SyncQueueMinAggregateOutputType | null
    _max: SyncQueueMaxAggregateOutputType | null
  }

  type GetSyncQueueGroupByPayload<T extends SyncQueueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SyncQueueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SyncQueueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SyncQueueGroupByOutputType[P]>
            : GetScalarType<T[P], SyncQueueGroupByOutputType[P]>
        }
      >
    >


  export type SyncQueueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    payload?: boolean
    status?: boolean
    retryCount?: boolean
    retryAt?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncQueue"]>

  export type SyncQueueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    payload?: boolean
    status?: boolean
    retryCount?: boolean
    retryAt?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncQueue"]>

  export type SyncQueueSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    payload?: boolean
    status?: boolean
    retryCount?: boolean
    retryAt?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncQueue"]>

  export type SyncQueueSelectScalar = {
    id?: boolean
    action?: boolean
    payload?: boolean
    status?: boolean
    retryCount?: boolean
    retryAt?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SyncQueueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "action" | "payload" | "status" | "retryCount" | "retryAt" | "error" | "createdAt" | "updatedAt", ExtArgs["result"]["syncQueue"]>

  export type $SyncQueuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SyncQueue"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: string
      payload: string
      status: string
      retryCount: number
      retryAt: Date | null
      error: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["syncQueue"]>
    composites: {}
  }

  type SyncQueueGetPayload<S extends boolean | null | undefined | SyncQueueDefaultArgs> = $Result.GetResult<Prisma.$SyncQueuePayload, S>

  type SyncQueueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SyncQueueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SyncQueueCountAggregateInputType | true
    }

  export interface SyncQueueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SyncQueue'], meta: { name: 'SyncQueue' } }
    /**
     * Find zero or one SyncQueue that matches the filter.
     * @param {SyncQueueFindUniqueArgs} args - Arguments to find a SyncQueue
     * @example
     * // Get one SyncQueue
     * const syncQueue = await prisma.syncQueue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SyncQueueFindUniqueArgs>(args: SelectSubset<T, SyncQueueFindUniqueArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SyncQueue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SyncQueueFindUniqueOrThrowArgs} args - Arguments to find a SyncQueue
     * @example
     * // Get one SyncQueue
     * const syncQueue = await prisma.syncQueue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SyncQueueFindUniqueOrThrowArgs>(args: SelectSubset<T, SyncQueueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncQueue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueFindFirstArgs} args - Arguments to find a SyncQueue
     * @example
     * // Get one SyncQueue
     * const syncQueue = await prisma.syncQueue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SyncQueueFindFirstArgs>(args?: SelectSubset<T, SyncQueueFindFirstArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncQueue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueFindFirstOrThrowArgs} args - Arguments to find a SyncQueue
     * @example
     * // Get one SyncQueue
     * const syncQueue = await prisma.syncQueue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SyncQueueFindFirstOrThrowArgs>(args?: SelectSubset<T, SyncQueueFindFirstOrThrowArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SyncQueues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SyncQueues
     * const syncQueues = await prisma.syncQueue.findMany()
     * 
     * // Get first 10 SyncQueues
     * const syncQueues = await prisma.syncQueue.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const syncQueueWithIdOnly = await prisma.syncQueue.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SyncQueueFindManyArgs>(args?: SelectSubset<T, SyncQueueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SyncQueue.
     * @param {SyncQueueCreateArgs} args - Arguments to create a SyncQueue.
     * @example
     * // Create one SyncQueue
     * const SyncQueue = await prisma.syncQueue.create({
     *   data: {
     *     // ... data to create a SyncQueue
     *   }
     * })
     * 
     */
    create<T extends SyncQueueCreateArgs>(args: SelectSubset<T, SyncQueueCreateArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SyncQueues.
     * @param {SyncQueueCreateManyArgs} args - Arguments to create many SyncQueues.
     * @example
     * // Create many SyncQueues
     * const syncQueue = await prisma.syncQueue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SyncQueueCreateManyArgs>(args?: SelectSubset<T, SyncQueueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SyncQueues and returns the data saved in the database.
     * @param {SyncQueueCreateManyAndReturnArgs} args - Arguments to create many SyncQueues.
     * @example
     * // Create many SyncQueues
     * const syncQueue = await prisma.syncQueue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SyncQueues and only return the `id`
     * const syncQueueWithIdOnly = await prisma.syncQueue.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SyncQueueCreateManyAndReturnArgs>(args?: SelectSubset<T, SyncQueueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SyncQueue.
     * @param {SyncQueueDeleteArgs} args - Arguments to delete one SyncQueue.
     * @example
     * // Delete one SyncQueue
     * const SyncQueue = await prisma.syncQueue.delete({
     *   where: {
     *     // ... filter to delete one SyncQueue
     *   }
     * })
     * 
     */
    delete<T extends SyncQueueDeleteArgs>(args: SelectSubset<T, SyncQueueDeleteArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SyncQueue.
     * @param {SyncQueueUpdateArgs} args - Arguments to update one SyncQueue.
     * @example
     * // Update one SyncQueue
     * const syncQueue = await prisma.syncQueue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SyncQueueUpdateArgs>(args: SelectSubset<T, SyncQueueUpdateArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SyncQueues.
     * @param {SyncQueueDeleteManyArgs} args - Arguments to filter SyncQueues to delete.
     * @example
     * // Delete a few SyncQueues
     * const { count } = await prisma.syncQueue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SyncQueueDeleteManyArgs>(args?: SelectSubset<T, SyncQueueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SyncQueues
     * const syncQueue = await prisma.syncQueue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SyncQueueUpdateManyArgs>(args: SelectSubset<T, SyncQueueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncQueues and returns the data updated in the database.
     * @param {SyncQueueUpdateManyAndReturnArgs} args - Arguments to update many SyncQueues.
     * @example
     * // Update many SyncQueues
     * const syncQueue = await prisma.syncQueue.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SyncQueues and only return the `id`
     * const syncQueueWithIdOnly = await prisma.syncQueue.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SyncQueueUpdateManyAndReturnArgs>(args: SelectSubset<T, SyncQueueUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SyncQueue.
     * @param {SyncQueueUpsertArgs} args - Arguments to update or create a SyncQueue.
     * @example
     * // Update or create a SyncQueue
     * const syncQueue = await prisma.syncQueue.upsert({
     *   create: {
     *     // ... data to create a SyncQueue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SyncQueue we want to update
     *   }
     * })
     */
    upsert<T extends SyncQueueUpsertArgs>(args: SelectSubset<T, SyncQueueUpsertArgs<ExtArgs>>): Prisma__SyncQueueClient<$Result.GetResult<Prisma.$SyncQueuePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SyncQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueCountArgs} args - Arguments to filter SyncQueues to count.
     * @example
     * // Count the number of SyncQueues
     * const count = await prisma.syncQueue.count({
     *   where: {
     *     // ... the filter for the SyncQueues we want to count
     *   }
     * })
    **/
    count<T extends SyncQueueCountArgs>(
      args?: Subset<T, SyncQueueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SyncQueueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SyncQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SyncQueueAggregateArgs>(args: Subset<T, SyncQueueAggregateArgs>): Prisma.PrismaPromise<GetSyncQueueAggregateType<T>>

    /**
     * Group by SyncQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SyncQueueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SyncQueueGroupByArgs['orderBy'] }
        : { orderBy?: SyncQueueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SyncQueueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSyncQueueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SyncQueue model
   */
  readonly fields: SyncQueueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SyncQueue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SyncQueueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SyncQueue model
   */
  interface SyncQueueFieldRefs {
    readonly id: FieldRef<"SyncQueue", 'String'>
    readonly action: FieldRef<"SyncQueue", 'String'>
    readonly payload: FieldRef<"SyncQueue", 'String'>
    readonly status: FieldRef<"SyncQueue", 'String'>
    readonly retryCount: FieldRef<"SyncQueue", 'Int'>
    readonly retryAt: FieldRef<"SyncQueue", 'DateTime'>
    readonly error: FieldRef<"SyncQueue", 'String'>
    readonly createdAt: FieldRef<"SyncQueue", 'DateTime'>
    readonly updatedAt: FieldRef<"SyncQueue", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SyncQueue findUnique
   */
  export type SyncQueueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueue to fetch.
     */
    where: SyncQueueWhereUniqueInput
  }

  /**
   * SyncQueue findUniqueOrThrow
   */
  export type SyncQueueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueue to fetch.
     */
    where: SyncQueueWhereUniqueInput
  }

  /**
   * SyncQueue findFirst
   */
  export type SyncQueueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueue to fetch.
     */
    where?: SyncQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueues to fetch.
     */
    orderBy?: SyncQueueOrderByWithRelationInput | SyncQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncQueues.
     */
    cursor?: SyncQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncQueues.
     */
    distinct?: SyncQueueScalarFieldEnum | SyncQueueScalarFieldEnum[]
  }

  /**
   * SyncQueue findFirstOrThrow
   */
  export type SyncQueueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueue to fetch.
     */
    where?: SyncQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueues to fetch.
     */
    orderBy?: SyncQueueOrderByWithRelationInput | SyncQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncQueues.
     */
    cursor?: SyncQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncQueues.
     */
    distinct?: SyncQueueScalarFieldEnum | SyncQueueScalarFieldEnum[]
  }

  /**
   * SyncQueue findMany
   */
  export type SyncQueueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueues to fetch.
     */
    where?: SyncQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueues to fetch.
     */
    orderBy?: SyncQueueOrderByWithRelationInput | SyncQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SyncQueues.
     */
    cursor?: SyncQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncQueues.
     */
    distinct?: SyncQueueScalarFieldEnum | SyncQueueScalarFieldEnum[]
  }

  /**
   * SyncQueue create
   */
  export type SyncQueueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * The data needed to create a SyncQueue.
     */
    data: XOR<SyncQueueCreateInput, SyncQueueUncheckedCreateInput>
  }

  /**
   * SyncQueue createMany
   */
  export type SyncQueueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SyncQueues.
     */
    data: SyncQueueCreateManyInput | SyncQueueCreateManyInput[]
  }

  /**
   * SyncQueue createManyAndReturn
   */
  export type SyncQueueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * The data used to create many SyncQueues.
     */
    data: SyncQueueCreateManyInput | SyncQueueCreateManyInput[]
  }

  /**
   * SyncQueue update
   */
  export type SyncQueueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * The data needed to update a SyncQueue.
     */
    data: XOR<SyncQueueUpdateInput, SyncQueueUncheckedUpdateInput>
    /**
     * Choose, which SyncQueue to update.
     */
    where: SyncQueueWhereUniqueInput
  }

  /**
   * SyncQueue updateMany
   */
  export type SyncQueueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SyncQueues.
     */
    data: XOR<SyncQueueUpdateManyMutationInput, SyncQueueUncheckedUpdateManyInput>
    /**
     * Filter which SyncQueues to update
     */
    where?: SyncQueueWhereInput
    /**
     * Limit how many SyncQueues to update.
     */
    limit?: number
  }

  /**
   * SyncQueue updateManyAndReturn
   */
  export type SyncQueueUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * The data used to update SyncQueues.
     */
    data: XOR<SyncQueueUpdateManyMutationInput, SyncQueueUncheckedUpdateManyInput>
    /**
     * Filter which SyncQueues to update
     */
    where?: SyncQueueWhereInput
    /**
     * Limit how many SyncQueues to update.
     */
    limit?: number
  }

  /**
   * SyncQueue upsert
   */
  export type SyncQueueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * The filter to search for the SyncQueue to update in case it exists.
     */
    where: SyncQueueWhereUniqueInput
    /**
     * In case the SyncQueue found by the `where` argument doesn't exist, create a new SyncQueue with this data.
     */
    create: XOR<SyncQueueCreateInput, SyncQueueUncheckedCreateInput>
    /**
     * In case the SyncQueue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SyncQueueUpdateInput, SyncQueueUncheckedUpdateInput>
  }

  /**
   * SyncQueue delete
   */
  export type SyncQueueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
    /**
     * Filter which SyncQueue to delete.
     */
    where: SyncQueueWhereUniqueInput
  }

  /**
   * SyncQueue deleteMany
   */
  export type SyncQueueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncQueues to delete
     */
    where?: SyncQueueWhereInput
    /**
     * Limit how many SyncQueues to delete.
     */
    limit?: number
  }

  /**
   * SyncQueue without action
   */
  export type SyncQueueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueue
     */
    select?: SyncQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueue
     */
    omit?: SyncQueueOmit<ExtArgs> | null
  }


  /**
   * Model SyncState
   */

  export type AggregateSyncState = {
    _count: SyncStateCountAggregateOutputType | null
    _avg: SyncStateAvgAggregateOutputType | null
    _sum: SyncStateSumAggregateOutputType | null
    _min: SyncStateMinAggregateOutputType | null
    _max: SyncStateMaxAggregateOutputType | null
  }

  export type SyncStateAvgAggregateOutputType = {
    pendingCount: number | null
    backoffMs: number | null
  }

  export type SyncStateSumAggregateOutputType = {
    pendingCount: number | null
    backoffMs: number | null
  }

  export type SyncStateMinAggregateOutputType = {
    id: string | null
    lastSyncAt: Date | null
    pendingCount: number | null
    syncInProgress: boolean | null
    cloudAvailable: boolean | null
    backoffMs: number | null
    updatedAt: Date | null
  }

  export type SyncStateMaxAggregateOutputType = {
    id: string | null
    lastSyncAt: Date | null
    pendingCount: number | null
    syncInProgress: boolean | null
    cloudAvailable: boolean | null
    backoffMs: number | null
    updatedAt: Date | null
  }

  export type SyncStateCountAggregateOutputType = {
    id: number
    lastSyncAt: number
    pendingCount: number
    syncInProgress: number
    cloudAvailable: number
    backoffMs: number
    updatedAt: number
    _all: number
  }


  export type SyncStateAvgAggregateInputType = {
    pendingCount?: true
    backoffMs?: true
  }

  export type SyncStateSumAggregateInputType = {
    pendingCount?: true
    backoffMs?: true
  }

  export type SyncStateMinAggregateInputType = {
    id?: true
    lastSyncAt?: true
    pendingCount?: true
    syncInProgress?: true
    cloudAvailable?: true
    backoffMs?: true
    updatedAt?: true
  }

  export type SyncStateMaxAggregateInputType = {
    id?: true
    lastSyncAt?: true
    pendingCount?: true
    syncInProgress?: true
    cloudAvailable?: true
    backoffMs?: true
    updatedAt?: true
  }

  export type SyncStateCountAggregateInputType = {
    id?: true
    lastSyncAt?: true
    pendingCount?: true
    syncInProgress?: true
    cloudAvailable?: true
    backoffMs?: true
    updatedAt?: true
    _all?: true
  }

  export type SyncStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncState to aggregate.
     */
    where?: SyncStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncStates to fetch.
     */
    orderBy?: SyncStateOrderByWithRelationInput | SyncStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SyncStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SyncStates
    **/
    _count?: true | SyncStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SyncStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SyncStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SyncStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SyncStateMaxAggregateInputType
  }

  export type GetSyncStateAggregateType<T extends SyncStateAggregateArgs> = {
        [P in keyof T & keyof AggregateSyncState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSyncState[P]>
      : GetScalarType<T[P], AggregateSyncState[P]>
  }




  export type SyncStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SyncStateWhereInput
    orderBy?: SyncStateOrderByWithAggregationInput | SyncStateOrderByWithAggregationInput[]
    by: SyncStateScalarFieldEnum[] | SyncStateScalarFieldEnum
    having?: SyncStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SyncStateCountAggregateInputType | true
    _avg?: SyncStateAvgAggregateInputType
    _sum?: SyncStateSumAggregateInputType
    _min?: SyncStateMinAggregateInputType
    _max?: SyncStateMaxAggregateInputType
  }

  export type SyncStateGroupByOutputType = {
    id: string
    lastSyncAt: Date | null
    pendingCount: number
    syncInProgress: boolean
    cloudAvailable: boolean
    backoffMs: number
    updatedAt: Date
    _count: SyncStateCountAggregateOutputType | null
    _avg: SyncStateAvgAggregateOutputType | null
    _sum: SyncStateSumAggregateOutputType | null
    _min: SyncStateMinAggregateOutputType | null
    _max: SyncStateMaxAggregateOutputType | null
  }

  type GetSyncStateGroupByPayload<T extends SyncStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SyncStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SyncStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SyncStateGroupByOutputType[P]>
            : GetScalarType<T[P], SyncStateGroupByOutputType[P]>
        }
      >
    >


  export type SyncStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastSyncAt?: boolean
    pendingCount?: boolean
    syncInProgress?: boolean
    cloudAvailable?: boolean
    backoffMs?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncState"]>

  export type SyncStateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastSyncAt?: boolean
    pendingCount?: boolean
    syncInProgress?: boolean
    cloudAvailable?: boolean
    backoffMs?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncState"]>

  export type SyncStateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastSyncAt?: boolean
    pendingCount?: boolean
    syncInProgress?: boolean
    cloudAvailable?: boolean
    backoffMs?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncState"]>

  export type SyncStateSelectScalar = {
    id?: boolean
    lastSyncAt?: boolean
    pendingCount?: boolean
    syncInProgress?: boolean
    cloudAvailable?: boolean
    backoffMs?: boolean
    updatedAt?: boolean
  }

  export type SyncStateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lastSyncAt" | "pendingCount" | "syncInProgress" | "cloudAvailable" | "backoffMs" | "updatedAt", ExtArgs["result"]["syncState"]>

  export type $SyncStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SyncState"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      lastSyncAt: Date | null
      pendingCount: number
      syncInProgress: boolean
      cloudAvailable: boolean
      backoffMs: number
      updatedAt: Date
    }, ExtArgs["result"]["syncState"]>
    composites: {}
  }

  type SyncStateGetPayload<S extends boolean | null | undefined | SyncStateDefaultArgs> = $Result.GetResult<Prisma.$SyncStatePayload, S>

  type SyncStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SyncStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SyncStateCountAggregateInputType | true
    }

  export interface SyncStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SyncState'], meta: { name: 'SyncState' } }
    /**
     * Find zero or one SyncState that matches the filter.
     * @param {SyncStateFindUniqueArgs} args - Arguments to find a SyncState
     * @example
     * // Get one SyncState
     * const syncState = await prisma.syncState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SyncStateFindUniqueArgs>(args: SelectSubset<T, SyncStateFindUniqueArgs<ExtArgs>>): Prisma__SyncStateClient<$Result.GetResult<Prisma.$SyncStatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SyncState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SyncStateFindUniqueOrThrowArgs} args - Arguments to find a SyncState
     * @example
     * // Get one SyncState
     * const syncState = await prisma.syncState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SyncStateFindUniqueOrThrowArgs>(args: SelectSubset<T, SyncStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SyncStateClient<$Result.GetResult<Prisma.$SyncStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncStateFindFirstArgs} args - Arguments to find a SyncState
     * @example
     * // Get one SyncState
     * const syncState = await prisma.syncState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SyncStateFindFirstArgs>(args?: SelectSubset<T, SyncStateFindFirstArgs<ExtArgs>>): Prisma__SyncStateClient<$Result.GetResult<Prisma.$SyncStatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncStateFindFirstOrThrowArgs} args - Arguments to find a SyncState
     * @example
     * // Get one SyncState
     * const syncState = await prisma.syncState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SyncStateFindFirstOrThrowArgs>(args?: SelectSubset<T, SyncStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__SyncStateClient<$Result.GetResult<Prisma.$SyncStatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SyncStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SyncStates
     * const syncStates = await prisma.syncState.findMany()
     * 
     * // Get first 10 SyncStates
     * const syncStates = await prisma.syncState.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const syncStateWithIdOnly = await prisma.syncState.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SyncStateFindManyArgs>(args?: SelectSubset<T, SyncStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SyncState.
     * @param {SyncStateCreateArgs} args - Arguments to create a SyncState.
     * @example
     * // Create one SyncState
     * const SyncState = await prisma.syncState.create({
     *   data: {
     *     // ... data to create a SyncState
     *   }
     * })
     * 
     */
    create<T extends SyncStateCreateArgs>(args: SelectSubset<T, SyncStateCreateArgs<ExtArgs>>): Prisma__SyncStateClient<$Result.GetResult<Prisma.$SyncStatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SyncStates.
     * @param {SyncStateCreateManyArgs} args - Arguments to create many SyncStates.
     * @example
     * // Create many SyncStates
     * const syncState = await prisma.syncState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SyncStateCreateManyArgs>(args?: SelectSubset<T, SyncStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SyncStates and returns the data saved in the database.
     * @param {SyncStateCreateManyAndReturnArgs} args - Arguments to create many SyncStates.
     * @example
     * // Create many SyncStates
     * const syncState = await prisma.syncState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SyncStates and only return the `id`
     * const syncStateWithIdOnly = await prisma.syncState.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SyncStateCreateManyAndReturnArgs>(args?: SelectSubset<T, SyncStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncStatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SyncState.
     * @param {SyncStateDeleteArgs} args - Arguments to delete one SyncState.
     * @example
     * // Delete one SyncState
     * const SyncState = await prisma.syncState.delete({
     *   where: {
     *     // ... filter to delete one SyncState
     *   }
     * })
     * 
     */
    delete<T extends SyncStateDeleteArgs>(args: SelectSubset<T, SyncStateDeleteArgs<ExtArgs>>): Prisma__SyncStateClient<$Result.GetResult<Prisma.$SyncStatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SyncState.
     * @param {SyncStateUpdateArgs} args - Arguments to update one SyncState.
     * @example
     * // Update one SyncState
     * const syncState = await prisma.syncState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SyncStateUpdateArgs>(args: SelectSubset<T, SyncStateUpdateArgs<ExtArgs>>): Prisma__SyncStateClient<$Result.GetResult<Prisma.$SyncStatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SyncStates.
     * @param {SyncStateDeleteManyArgs} args - Arguments to filter SyncStates to delete.
     * @example
     * // Delete a few SyncStates
     * const { count } = await prisma.syncState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SyncStateDeleteManyArgs>(args?: SelectSubset<T, SyncStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SyncStates
     * const syncState = await prisma.syncState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SyncStateUpdateManyArgs>(args: SelectSubset<T, SyncStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncStates and returns the data updated in the database.
     * @param {SyncStateUpdateManyAndReturnArgs} args - Arguments to update many SyncStates.
     * @example
     * // Update many SyncStates
     * const syncState = await prisma.syncState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SyncStates and only return the `id`
     * const syncStateWithIdOnly = await prisma.syncState.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SyncStateUpdateManyAndReturnArgs>(args: SelectSubset<T, SyncStateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncStatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SyncState.
     * @param {SyncStateUpsertArgs} args - Arguments to update or create a SyncState.
     * @example
     * // Update or create a SyncState
     * const syncState = await prisma.syncState.upsert({
     *   create: {
     *     // ... data to create a SyncState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SyncState we want to update
     *   }
     * })
     */
    upsert<T extends SyncStateUpsertArgs>(args: SelectSubset<T, SyncStateUpsertArgs<ExtArgs>>): Prisma__SyncStateClient<$Result.GetResult<Prisma.$SyncStatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SyncStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncStateCountArgs} args - Arguments to filter SyncStates to count.
     * @example
     * // Count the number of SyncStates
     * const count = await prisma.syncState.count({
     *   where: {
     *     // ... the filter for the SyncStates we want to count
     *   }
     * })
    **/
    count<T extends SyncStateCountArgs>(
      args?: Subset<T, SyncStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SyncStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SyncState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SyncStateAggregateArgs>(args: Subset<T, SyncStateAggregateArgs>): Prisma.PrismaPromise<GetSyncStateAggregateType<T>>

    /**
     * Group by SyncState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SyncStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SyncStateGroupByArgs['orderBy'] }
        : { orderBy?: SyncStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SyncStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSyncStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SyncState model
   */
  readonly fields: SyncStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SyncState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SyncStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SyncState model
   */
  interface SyncStateFieldRefs {
    readonly id: FieldRef<"SyncState", 'String'>
    readonly lastSyncAt: FieldRef<"SyncState", 'DateTime'>
    readonly pendingCount: FieldRef<"SyncState", 'Int'>
    readonly syncInProgress: FieldRef<"SyncState", 'Boolean'>
    readonly cloudAvailable: FieldRef<"SyncState", 'Boolean'>
    readonly backoffMs: FieldRef<"SyncState", 'Int'>
    readonly updatedAt: FieldRef<"SyncState", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SyncState findUnique
   */
  export type SyncStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
    /**
     * Filter, which SyncState to fetch.
     */
    where: SyncStateWhereUniqueInput
  }

  /**
   * SyncState findUniqueOrThrow
   */
  export type SyncStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
    /**
     * Filter, which SyncState to fetch.
     */
    where: SyncStateWhereUniqueInput
  }

  /**
   * SyncState findFirst
   */
  export type SyncStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
    /**
     * Filter, which SyncState to fetch.
     */
    where?: SyncStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncStates to fetch.
     */
    orderBy?: SyncStateOrderByWithRelationInput | SyncStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncStates.
     */
    cursor?: SyncStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncStates.
     */
    distinct?: SyncStateScalarFieldEnum | SyncStateScalarFieldEnum[]
  }

  /**
   * SyncState findFirstOrThrow
   */
  export type SyncStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
    /**
     * Filter, which SyncState to fetch.
     */
    where?: SyncStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncStates to fetch.
     */
    orderBy?: SyncStateOrderByWithRelationInput | SyncStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncStates.
     */
    cursor?: SyncStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncStates.
     */
    distinct?: SyncStateScalarFieldEnum | SyncStateScalarFieldEnum[]
  }

  /**
   * SyncState findMany
   */
  export type SyncStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
    /**
     * Filter, which SyncStates to fetch.
     */
    where?: SyncStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncStates to fetch.
     */
    orderBy?: SyncStateOrderByWithRelationInput | SyncStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SyncStates.
     */
    cursor?: SyncStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncStates.
     */
    distinct?: SyncStateScalarFieldEnum | SyncStateScalarFieldEnum[]
  }

  /**
   * SyncState create
   */
  export type SyncStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
    /**
     * The data needed to create a SyncState.
     */
    data: XOR<SyncStateCreateInput, SyncStateUncheckedCreateInput>
  }

  /**
   * SyncState createMany
   */
  export type SyncStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SyncStates.
     */
    data: SyncStateCreateManyInput | SyncStateCreateManyInput[]
  }

  /**
   * SyncState createManyAndReturn
   */
  export type SyncStateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
    /**
     * The data used to create many SyncStates.
     */
    data: SyncStateCreateManyInput | SyncStateCreateManyInput[]
  }

  /**
   * SyncState update
   */
  export type SyncStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
    /**
     * The data needed to update a SyncState.
     */
    data: XOR<SyncStateUpdateInput, SyncStateUncheckedUpdateInput>
    /**
     * Choose, which SyncState to update.
     */
    where: SyncStateWhereUniqueInput
  }

  /**
   * SyncState updateMany
   */
  export type SyncStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SyncStates.
     */
    data: XOR<SyncStateUpdateManyMutationInput, SyncStateUncheckedUpdateManyInput>
    /**
     * Filter which SyncStates to update
     */
    where?: SyncStateWhereInput
    /**
     * Limit how many SyncStates to update.
     */
    limit?: number
  }

  /**
   * SyncState updateManyAndReturn
   */
  export type SyncStateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
    /**
     * The data used to update SyncStates.
     */
    data: XOR<SyncStateUpdateManyMutationInput, SyncStateUncheckedUpdateManyInput>
    /**
     * Filter which SyncStates to update
     */
    where?: SyncStateWhereInput
    /**
     * Limit how many SyncStates to update.
     */
    limit?: number
  }

  /**
   * SyncState upsert
   */
  export type SyncStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
    /**
     * The filter to search for the SyncState to update in case it exists.
     */
    where: SyncStateWhereUniqueInput
    /**
     * In case the SyncState found by the `where` argument doesn't exist, create a new SyncState with this data.
     */
    create: XOR<SyncStateCreateInput, SyncStateUncheckedCreateInput>
    /**
     * In case the SyncState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SyncStateUpdateInput, SyncStateUncheckedUpdateInput>
  }

  /**
   * SyncState delete
   */
  export type SyncStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
    /**
     * Filter which SyncState to delete.
     */
    where: SyncStateWhereUniqueInput
  }

  /**
   * SyncState deleteMany
   */
  export type SyncStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncStates to delete
     */
    where?: SyncStateWhereInput
    /**
     * Limit how many SyncStates to delete.
     */
    limit?: number
  }

  /**
   * SyncState without action
   */
  export type SyncStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncState
     */
    select?: SyncStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncState
     */
    omit?: SyncStateOmit<ExtArgs> | null
  }


  /**
   * Model PrinterConfig
   */

  export type AggregatePrinterConfig = {
    _count: PrinterConfigCountAggregateOutputType | null
    _avg: PrinterConfigAvgAggregateOutputType | null
    _sum: PrinterConfigSumAggregateOutputType | null
    _min: PrinterConfigMinAggregateOutputType | null
    _max: PrinterConfigMaxAggregateOutputType | null
  }

  export type PrinterConfigAvgAggregateOutputType = {
    vendorId: number | null
    productId: number | null
    paperWidth: number | null
  }

  export type PrinterConfigSumAggregateOutputType = {
    vendorId: number | null
    productId: number | null
    paperWidth: number | null
  }

  export type PrinterConfigMinAggregateOutputType = {
    id: string | null
    name: string | null
    displayName: string | null
    type: string | null
    connection: string | null
    address: string | null
    vendorId: number | null
    productId: number | null
    paperWidth: number | null
    isDefault: boolean | null
    isActive: boolean | null
    isKitchen: boolean | null
    isBilling: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PrinterConfigMaxAggregateOutputType = {
    id: string | null
    name: string | null
    displayName: string | null
    type: string | null
    connection: string | null
    address: string | null
    vendorId: number | null
    productId: number | null
    paperWidth: number | null
    isDefault: boolean | null
    isActive: boolean | null
    isKitchen: boolean | null
    isBilling: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PrinterConfigCountAggregateOutputType = {
    id: number
    name: number
    displayName: number
    type: number
    connection: number
    address: number
    vendorId: number
    productId: number
    paperWidth: number
    isDefault: number
    isActive: number
    isKitchen: number
    isBilling: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PrinterConfigAvgAggregateInputType = {
    vendorId?: true
    productId?: true
    paperWidth?: true
  }

  export type PrinterConfigSumAggregateInputType = {
    vendorId?: true
    productId?: true
    paperWidth?: true
  }

  export type PrinterConfigMinAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    type?: true
    connection?: true
    address?: true
    vendorId?: true
    productId?: true
    paperWidth?: true
    isDefault?: true
    isActive?: true
    isKitchen?: true
    isBilling?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PrinterConfigMaxAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    type?: true
    connection?: true
    address?: true
    vendorId?: true
    productId?: true
    paperWidth?: true
    isDefault?: true
    isActive?: true
    isKitchen?: true
    isBilling?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PrinterConfigCountAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    type?: true
    connection?: true
    address?: true
    vendorId?: true
    productId?: true
    paperWidth?: true
    isDefault?: true
    isActive?: true
    isKitchen?: true
    isBilling?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PrinterConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrinterConfig to aggregate.
     */
    where?: PrinterConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrinterConfigs to fetch.
     */
    orderBy?: PrinterConfigOrderByWithRelationInput | PrinterConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PrinterConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrinterConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrinterConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PrinterConfigs
    **/
    _count?: true | PrinterConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PrinterConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PrinterConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PrinterConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PrinterConfigMaxAggregateInputType
  }

  export type GetPrinterConfigAggregateType<T extends PrinterConfigAggregateArgs> = {
        [P in keyof T & keyof AggregatePrinterConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrinterConfig[P]>
      : GetScalarType<T[P], AggregatePrinterConfig[P]>
  }




  export type PrinterConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PrinterConfigWhereInput
    orderBy?: PrinterConfigOrderByWithAggregationInput | PrinterConfigOrderByWithAggregationInput[]
    by: PrinterConfigScalarFieldEnum[] | PrinterConfigScalarFieldEnum
    having?: PrinterConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PrinterConfigCountAggregateInputType | true
    _avg?: PrinterConfigAvgAggregateInputType
    _sum?: PrinterConfigSumAggregateInputType
    _min?: PrinterConfigMinAggregateInputType
    _max?: PrinterConfigMaxAggregateInputType
  }

  export type PrinterConfigGroupByOutputType = {
    id: string
    name: string
    displayName: string
    type: string
    connection: string
    address: string | null
    vendorId: number | null
    productId: number | null
    paperWidth: number
    isDefault: boolean
    isActive: boolean
    isKitchen: boolean
    isBilling: boolean
    createdAt: Date
    updatedAt: Date
    _count: PrinterConfigCountAggregateOutputType | null
    _avg: PrinterConfigAvgAggregateOutputType | null
    _sum: PrinterConfigSumAggregateOutputType | null
    _min: PrinterConfigMinAggregateOutputType | null
    _max: PrinterConfigMaxAggregateOutputType | null
  }

  type GetPrinterConfigGroupByPayload<T extends PrinterConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PrinterConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PrinterConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PrinterConfigGroupByOutputType[P]>
            : GetScalarType<T[P], PrinterConfigGroupByOutputType[P]>
        }
      >
    >


  export type PrinterConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    type?: boolean
    connection?: boolean
    address?: boolean
    vendorId?: boolean
    productId?: boolean
    paperWidth?: boolean
    isDefault?: boolean
    isActive?: boolean
    isKitchen?: boolean
    isBilling?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    printHistory?: boolean | PrinterConfig$printHistoryArgs<ExtArgs>
    _count?: boolean | PrinterConfigCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["printerConfig"]>

  export type PrinterConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    type?: boolean
    connection?: boolean
    address?: boolean
    vendorId?: boolean
    productId?: boolean
    paperWidth?: boolean
    isDefault?: boolean
    isActive?: boolean
    isKitchen?: boolean
    isBilling?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["printerConfig"]>

  export type PrinterConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    type?: boolean
    connection?: boolean
    address?: boolean
    vendorId?: boolean
    productId?: boolean
    paperWidth?: boolean
    isDefault?: boolean
    isActive?: boolean
    isKitchen?: boolean
    isBilling?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["printerConfig"]>

  export type PrinterConfigSelectScalar = {
    id?: boolean
    name?: boolean
    displayName?: boolean
    type?: boolean
    connection?: boolean
    address?: boolean
    vendorId?: boolean
    productId?: boolean
    paperWidth?: boolean
    isDefault?: boolean
    isActive?: boolean
    isKitchen?: boolean
    isBilling?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PrinterConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "displayName" | "type" | "connection" | "address" | "vendorId" | "productId" | "paperWidth" | "isDefault" | "isActive" | "isKitchen" | "isBilling" | "createdAt" | "updatedAt", ExtArgs["result"]["printerConfig"]>
  export type PrinterConfigInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    printHistory?: boolean | PrinterConfig$printHistoryArgs<ExtArgs>
    _count?: boolean | PrinterConfigCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PrinterConfigIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PrinterConfigIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PrinterConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PrinterConfig"
    objects: {
      printHistory: Prisma.$PrintHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      displayName: string
      type: string
      connection: string
      address: string | null
      vendorId: number | null
      productId: number | null
      paperWidth: number
      isDefault: boolean
      isActive: boolean
      isKitchen: boolean
      isBilling: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["printerConfig"]>
    composites: {}
  }

  type PrinterConfigGetPayload<S extends boolean | null | undefined | PrinterConfigDefaultArgs> = $Result.GetResult<Prisma.$PrinterConfigPayload, S>

  type PrinterConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PrinterConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PrinterConfigCountAggregateInputType | true
    }

  export interface PrinterConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PrinterConfig'], meta: { name: 'PrinterConfig' } }
    /**
     * Find zero or one PrinterConfig that matches the filter.
     * @param {PrinterConfigFindUniqueArgs} args - Arguments to find a PrinterConfig
     * @example
     * // Get one PrinterConfig
     * const printerConfig = await prisma.printerConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PrinterConfigFindUniqueArgs>(args: SelectSubset<T, PrinterConfigFindUniqueArgs<ExtArgs>>): Prisma__PrinterConfigClient<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PrinterConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PrinterConfigFindUniqueOrThrowArgs} args - Arguments to find a PrinterConfig
     * @example
     * // Get one PrinterConfig
     * const printerConfig = await prisma.printerConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PrinterConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, PrinterConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PrinterConfigClient<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PrinterConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrinterConfigFindFirstArgs} args - Arguments to find a PrinterConfig
     * @example
     * // Get one PrinterConfig
     * const printerConfig = await prisma.printerConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PrinterConfigFindFirstArgs>(args?: SelectSubset<T, PrinterConfigFindFirstArgs<ExtArgs>>): Prisma__PrinterConfigClient<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PrinterConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrinterConfigFindFirstOrThrowArgs} args - Arguments to find a PrinterConfig
     * @example
     * // Get one PrinterConfig
     * const printerConfig = await prisma.printerConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PrinterConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, PrinterConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__PrinterConfigClient<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PrinterConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrinterConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PrinterConfigs
     * const printerConfigs = await prisma.printerConfig.findMany()
     * 
     * // Get first 10 PrinterConfigs
     * const printerConfigs = await prisma.printerConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const printerConfigWithIdOnly = await prisma.printerConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PrinterConfigFindManyArgs>(args?: SelectSubset<T, PrinterConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PrinterConfig.
     * @param {PrinterConfigCreateArgs} args - Arguments to create a PrinterConfig.
     * @example
     * // Create one PrinterConfig
     * const PrinterConfig = await prisma.printerConfig.create({
     *   data: {
     *     // ... data to create a PrinterConfig
     *   }
     * })
     * 
     */
    create<T extends PrinterConfigCreateArgs>(args: SelectSubset<T, PrinterConfigCreateArgs<ExtArgs>>): Prisma__PrinterConfigClient<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PrinterConfigs.
     * @param {PrinterConfigCreateManyArgs} args - Arguments to create many PrinterConfigs.
     * @example
     * // Create many PrinterConfigs
     * const printerConfig = await prisma.printerConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PrinterConfigCreateManyArgs>(args?: SelectSubset<T, PrinterConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PrinterConfigs and returns the data saved in the database.
     * @param {PrinterConfigCreateManyAndReturnArgs} args - Arguments to create many PrinterConfigs.
     * @example
     * // Create many PrinterConfigs
     * const printerConfig = await prisma.printerConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PrinterConfigs and only return the `id`
     * const printerConfigWithIdOnly = await prisma.printerConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PrinterConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, PrinterConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PrinterConfig.
     * @param {PrinterConfigDeleteArgs} args - Arguments to delete one PrinterConfig.
     * @example
     * // Delete one PrinterConfig
     * const PrinterConfig = await prisma.printerConfig.delete({
     *   where: {
     *     // ... filter to delete one PrinterConfig
     *   }
     * })
     * 
     */
    delete<T extends PrinterConfigDeleteArgs>(args: SelectSubset<T, PrinterConfigDeleteArgs<ExtArgs>>): Prisma__PrinterConfigClient<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PrinterConfig.
     * @param {PrinterConfigUpdateArgs} args - Arguments to update one PrinterConfig.
     * @example
     * // Update one PrinterConfig
     * const printerConfig = await prisma.printerConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PrinterConfigUpdateArgs>(args: SelectSubset<T, PrinterConfigUpdateArgs<ExtArgs>>): Prisma__PrinterConfigClient<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PrinterConfigs.
     * @param {PrinterConfigDeleteManyArgs} args - Arguments to filter PrinterConfigs to delete.
     * @example
     * // Delete a few PrinterConfigs
     * const { count } = await prisma.printerConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PrinterConfigDeleteManyArgs>(args?: SelectSubset<T, PrinterConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PrinterConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrinterConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PrinterConfigs
     * const printerConfig = await prisma.printerConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PrinterConfigUpdateManyArgs>(args: SelectSubset<T, PrinterConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PrinterConfigs and returns the data updated in the database.
     * @param {PrinterConfigUpdateManyAndReturnArgs} args - Arguments to update many PrinterConfigs.
     * @example
     * // Update many PrinterConfigs
     * const printerConfig = await prisma.printerConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PrinterConfigs and only return the `id`
     * const printerConfigWithIdOnly = await prisma.printerConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PrinterConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, PrinterConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PrinterConfig.
     * @param {PrinterConfigUpsertArgs} args - Arguments to update or create a PrinterConfig.
     * @example
     * // Update or create a PrinterConfig
     * const printerConfig = await prisma.printerConfig.upsert({
     *   create: {
     *     // ... data to create a PrinterConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PrinterConfig we want to update
     *   }
     * })
     */
    upsert<T extends PrinterConfigUpsertArgs>(args: SelectSubset<T, PrinterConfigUpsertArgs<ExtArgs>>): Prisma__PrinterConfigClient<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PrinterConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrinterConfigCountArgs} args - Arguments to filter PrinterConfigs to count.
     * @example
     * // Count the number of PrinterConfigs
     * const count = await prisma.printerConfig.count({
     *   where: {
     *     // ... the filter for the PrinterConfigs we want to count
     *   }
     * })
    **/
    count<T extends PrinterConfigCountArgs>(
      args?: Subset<T, PrinterConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PrinterConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PrinterConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrinterConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PrinterConfigAggregateArgs>(args: Subset<T, PrinterConfigAggregateArgs>): Prisma.PrismaPromise<GetPrinterConfigAggregateType<T>>

    /**
     * Group by PrinterConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrinterConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PrinterConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PrinterConfigGroupByArgs['orderBy'] }
        : { orderBy?: PrinterConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PrinterConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrinterConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PrinterConfig model
   */
  readonly fields: PrinterConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PrinterConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PrinterConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    printHistory<T extends PrinterConfig$printHistoryArgs<ExtArgs> = {}>(args?: Subset<T, PrinterConfig$printHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PrinterConfig model
   */
  interface PrinterConfigFieldRefs {
    readonly id: FieldRef<"PrinterConfig", 'String'>
    readonly name: FieldRef<"PrinterConfig", 'String'>
    readonly displayName: FieldRef<"PrinterConfig", 'String'>
    readonly type: FieldRef<"PrinterConfig", 'String'>
    readonly connection: FieldRef<"PrinterConfig", 'String'>
    readonly address: FieldRef<"PrinterConfig", 'String'>
    readonly vendorId: FieldRef<"PrinterConfig", 'Int'>
    readonly productId: FieldRef<"PrinterConfig", 'Int'>
    readonly paperWidth: FieldRef<"PrinterConfig", 'Int'>
    readonly isDefault: FieldRef<"PrinterConfig", 'Boolean'>
    readonly isActive: FieldRef<"PrinterConfig", 'Boolean'>
    readonly isKitchen: FieldRef<"PrinterConfig", 'Boolean'>
    readonly isBilling: FieldRef<"PrinterConfig", 'Boolean'>
    readonly createdAt: FieldRef<"PrinterConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"PrinterConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PrinterConfig findUnique
   */
  export type PrinterConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrinterConfigInclude<ExtArgs> | null
    /**
     * Filter, which PrinterConfig to fetch.
     */
    where: PrinterConfigWhereUniqueInput
  }

  /**
   * PrinterConfig findUniqueOrThrow
   */
  export type PrinterConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrinterConfigInclude<ExtArgs> | null
    /**
     * Filter, which PrinterConfig to fetch.
     */
    where: PrinterConfigWhereUniqueInput
  }

  /**
   * PrinterConfig findFirst
   */
  export type PrinterConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrinterConfigInclude<ExtArgs> | null
    /**
     * Filter, which PrinterConfig to fetch.
     */
    where?: PrinterConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrinterConfigs to fetch.
     */
    orderBy?: PrinterConfigOrderByWithRelationInput | PrinterConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrinterConfigs.
     */
    cursor?: PrinterConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrinterConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrinterConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrinterConfigs.
     */
    distinct?: PrinterConfigScalarFieldEnum | PrinterConfigScalarFieldEnum[]
  }

  /**
   * PrinterConfig findFirstOrThrow
   */
  export type PrinterConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrinterConfigInclude<ExtArgs> | null
    /**
     * Filter, which PrinterConfig to fetch.
     */
    where?: PrinterConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrinterConfigs to fetch.
     */
    orderBy?: PrinterConfigOrderByWithRelationInput | PrinterConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrinterConfigs.
     */
    cursor?: PrinterConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrinterConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrinterConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrinterConfigs.
     */
    distinct?: PrinterConfigScalarFieldEnum | PrinterConfigScalarFieldEnum[]
  }

  /**
   * PrinterConfig findMany
   */
  export type PrinterConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrinterConfigInclude<ExtArgs> | null
    /**
     * Filter, which PrinterConfigs to fetch.
     */
    where?: PrinterConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrinterConfigs to fetch.
     */
    orderBy?: PrinterConfigOrderByWithRelationInput | PrinterConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PrinterConfigs.
     */
    cursor?: PrinterConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrinterConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrinterConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrinterConfigs.
     */
    distinct?: PrinterConfigScalarFieldEnum | PrinterConfigScalarFieldEnum[]
  }

  /**
   * PrinterConfig create
   */
  export type PrinterConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrinterConfigInclude<ExtArgs> | null
    /**
     * The data needed to create a PrinterConfig.
     */
    data: XOR<PrinterConfigCreateInput, PrinterConfigUncheckedCreateInput>
  }

  /**
   * PrinterConfig createMany
   */
  export type PrinterConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PrinterConfigs.
     */
    data: PrinterConfigCreateManyInput | PrinterConfigCreateManyInput[]
  }

  /**
   * PrinterConfig createManyAndReturn
   */
  export type PrinterConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * The data used to create many PrinterConfigs.
     */
    data: PrinterConfigCreateManyInput | PrinterConfigCreateManyInput[]
  }

  /**
   * PrinterConfig update
   */
  export type PrinterConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrinterConfigInclude<ExtArgs> | null
    /**
     * The data needed to update a PrinterConfig.
     */
    data: XOR<PrinterConfigUpdateInput, PrinterConfigUncheckedUpdateInput>
    /**
     * Choose, which PrinterConfig to update.
     */
    where: PrinterConfigWhereUniqueInput
  }

  /**
   * PrinterConfig updateMany
   */
  export type PrinterConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PrinterConfigs.
     */
    data: XOR<PrinterConfigUpdateManyMutationInput, PrinterConfigUncheckedUpdateManyInput>
    /**
     * Filter which PrinterConfigs to update
     */
    where?: PrinterConfigWhereInput
    /**
     * Limit how many PrinterConfigs to update.
     */
    limit?: number
  }

  /**
   * PrinterConfig updateManyAndReturn
   */
  export type PrinterConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * The data used to update PrinterConfigs.
     */
    data: XOR<PrinterConfigUpdateManyMutationInput, PrinterConfigUncheckedUpdateManyInput>
    /**
     * Filter which PrinterConfigs to update
     */
    where?: PrinterConfigWhereInput
    /**
     * Limit how many PrinterConfigs to update.
     */
    limit?: number
  }

  /**
   * PrinterConfig upsert
   */
  export type PrinterConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrinterConfigInclude<ExtArgs> | null
    /**
     * The filter to search for the PrinterConfig to update in case it exists.
     */
    where: PrinterConfigWhereUniqueInput
    /**
     * In case the PrinterConfig found by the `where` argument doesn't exist, create a new PrinterConfig with this data.
     */
    create: XOR<PrinterConfigCreateInput, PrinterConfigUncheckedCreateInput>
    /**
     * In case the PrinterConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PrinterConfigUpdateInput, PrinterConfigUncheckedUpdateInput>
  }

  /**
   * PrinterConfig delete
   */
  export type PrinterConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrinterConfigInclude<ExtArgs> | null
    /**
     * Filter which PrinterConfig to delete.
     */
    where: PrinterConfigWhereUniqueInput
  }

  /**
   * PrinterConfig deleteMany
   */
  export type PrinterConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrinterConfigs to delete
     */
    where?: PrinterConfigWhereInput
    /**
     * Limit how many PrinterConfigs to delete.
     */
    limit?: number
  }

  /**
   * PrinterConfig.printHistory
   */
  export type PrinterConfig$printHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryInclude<ExtArgs> | null
    where?: PrintHistoryWhereInput
    orderBy?: PrintHistoryOrderByWithRelationInput | PrintHistoryOrderByWithRelationInput[]
    cursor?: PrintHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PrintHistoryScalarFieldEnum | PrintHistoryScalarFieldEnum[]
  }

  /**
   * PrinterConfig without action
   */
  export type PrinterConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterConfig
     */
    select?: PrinterConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrinterConfig
     */
    omit?: PrinterConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrinterConfigInclude<ExtArgs> | null
  }


  /**
   * Model PrintHistory
   */

  export type AggregatePrintHistory = {
    _count: PrintHistoryCountAggregateOutputType | null
    _avg: PrintHistoryAvgAggregateOutputType | null
    _sum: PrintHistorySumAggregateOutputType | null
    _min: PrintHistoryMinAggregateOutputType | null
    _max: PrintHistoryMaxAggregateOutputType | null
  }

  export type PrintHistoryAvgAggregateOutputType = {
    retryCount: number | null
  }

  export type PrintHistorySumAggregateOutputType = {
    retryCount: number | null
  }

  export type PrintHistoryMinAggregateOutputType = {
    id: string | null
    printerId: string | null
    printType: string | null
    orderId: string | null
    tableName: string | null
    status: string | null
    retryCount: number | null
    error: string | null
    createdAt: Date | null
  }

  export type PrintHistoryMaxAggregateOutputType = {
    id: string | null
    printerId: string | null
    printType: string | null
    orderId: string | null
    tableName: string | null
    status: string | null
    retryCount: number | null
    error: string | null
    createdAt: Date | null
  }

  export type PrintHistoryCountAggregateOutputType = {
    id: number
    printerId: number
    printType: number
    orderId: number
    tableName: number
    status: number
    retryCount: number
    error: number
    createdAt: number
    _all: number
  }


  export type PrintHistoryAvgAggregateInputType = {
    retryCount?: true
  }

  export type PrintHistorySumAggregateInputType = {
    retryCount?: true
  }

  export type PrintHistoryMinAggregateInputType = {
    id?: true
    printerId?: true
    printType?: true
    orderId?: true
    tableName?: true
    status?: true
    retryCount?: true
    error?: true
    createdAt?: true
  }

  export type PrintHistoryMaxAggregateInputType = {
    id?: true
    printerId?: true
    printType?: true
    orderId?: true
    tableName?: true
    status?: true
    retryCount?: true
    error?: true
    createdAt?: true
  }

  export type PrintHistoryCountAggregateInputType = {
    id?: true
    printerId?: true
    printType?: true
    orderId?: true
    tableName?: true
    status?: true
    retryCount?: true
    error?: true
    createdAt?: true
    _all?: true
  }

  export type PrintHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrintHistory to aggregate.
     */
    where?: PrintHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrintHistories to fetch.
     */
    orderBy?: PrintHistoryOrderByWithRelationInput | PrintHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PrintHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrintHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrintHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PrintHistories
    **/
    _count?: true | PrintHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PrintHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PrintHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PrintHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PrintHistoryMaxAggregateInputType
  }

  export type GetPrintHistoryAggregateType<T extends PrintHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregatePrintHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrintHistory[P]>
      : GetScalarType<T[P], AggregatePrintHistory[P]>
  }




  export type PrintHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PrintHistoryWhereInput
    orderBy?: PrintHistoryOrderByWithAggregationInput | PrintHistoryOrderByWithAggregationInput[]
    by: PrintHistoryScalarFieldEnum[] | PrintHistoryScalarFieldEnum
    having?: PrintHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PrintHistoryCountAggregateInputType | true
    _avg?: PrintHistoryAvgAggregateInputType
    _sum?: PrintHistorySumAggregateInputType
    _min?: PrintHistoryMinAggregateInputType
    _max?: PrintHistoryMaxAggregateInputType
  }

  export type PrintHistoryGroupByOutputType = {
    id: string
    printerId: string
    printType: string
    orderId: string | null
    tableName: string | null
    status: string
    retryCount: number
    error: string | null
    createdAt: Date
    _count: PrintHistoryCountAggregateOutputType | null
    _avg: PrintHistoryAvgAggregateOutputType | null
    _sum: PrintHistorySumAggregateOutputType | null
    _min: PrintHistoryMinAggregateOutputType | null
    _max: PrintHistoryMaxAggregateOutputType | null
  }

  type GetPrintHistoryGroupByPayload<T extends PrintHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PrintHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PrintHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PrintHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], PrintHistoryGroupByOutputType[P]>
        }
      >
    >


  export type PrintHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    printerId?: boolean
    printType?: boolean
    orderId?: boolean
    tableName?: boolean
    status?: boolean
    retryCount?: boolean
    error?: boolean
    createdAt?: boolean
    printer?: boolean | PrinterConfigDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["printHistory"]>

  export type PrintHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    printerId?: boolean
    printType?: boolean
    orderId?: boolean
    tableName?: boolean
    status?: boolean
    retryCount?: boolean
    error?: boolean
    createdAt?: boolean
    printer?: boolean | PrinterConfigDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["printHistory"]>

  export type PrintHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    printerId?: boolean
    printType?: boolean
    orderId?: boolean
    tableName?: boolean
    status?: boolean
    retryCount?: boolean
    error?: boolean
    createdAt?: boolean
    printer?: boolean | PrinterConfigDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["printHistory"]>

  export type PrintHistorySelectScalar = {
    id?: boolean
    printerId?: boolean
    printType?: boolean
    orderId?: boolean
    tableName?: boolean
    status?: boolean
    retryCount?: boolean
    error?: boolean
    createdAt?: boolean
  }

  export type PrintHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "printerId" | "printType" | "orderId" | "tableName" | "status" | "retryCount" | "error" | "createdAt", ExtArgs["result"]["printHistory"]>
  export type PrintHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    printer?: boolean | PrinterConfigDefaultArgs<ExtArgs>
  }
  export type PrintHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    printer?: boolean | PrinterConfigDefaultArgs<ExtArgs>
  }
  export type PrintHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    printer?: boolean | PrinterConfigDefaultArgs<ExtArgs>
  }

  export type $PrintHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PrintHistory"
    objects: {
      printer: Prisma.$PrinterConfigPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      printerId: string
      printType: string
      orderId: string | null
      tableName: string | null
      status: string
      retryCount: number
      error: string | null
      createdAt: Date
    }, ExtArgs["result"]["printHistory"]>
    composites: {}
  }

  type PrintHistoryGetPayload<S extends boolean | null | undefined | PrintHistoryDefaultArgs> = $Result.GetResult<Prisma.$PrintHistoryPayload, S>

  type PrintHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PrintHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PrintHistoryCountAggregateInputType | true
    }

  export interface PrintHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PrintHistory'], meta: { name: 'PrintHistory' } }
    /**
     * Find zero or one PrintHistory that matches the filter.
     * @param {PrintHistoryFindUniqueArgs} args - Arguments to find a PrintHistory
     * @example
     * // Get one PrintHistory
     * const printHistory = await prisma.printHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PrintHistoryFindUniqueArgs>(args: SelectSubset<T, PrintHistoryFindUniqueArgs<ExtArgs>>): Prisma__PrintHistoryClient<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PrintHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PrintHistoryFindUniqueOrThrowArgs} args - Arguments to find a PrintHistory
     * @example
     * // Get one PrintHistory
     * const printHistory = await prisma.printHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PrintHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, PrintHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PrintHistoryClient<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PrintHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrintHistoryFindFirstArgs} args - Arguments to find a PrintHistory
     * @example
     * // Get one PrintHistory
     * const printHistory = await prisma.printHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PrintHistoryFindFirstArgs>(args?: SelectSubset<T, PrintHistoryFindFirstArgs<ExtArgs>>): Prisma__PrintHistoryClient<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PrintHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrintHistoryFindFirstOrThrowArgs} args - Arguments to find a PrintHistory
     * @example
     * // Get one PrintHistory
     * const printHistory = await prisma.printHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PrintHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, PrintHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__PrintHistoryClient<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PrintHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrintHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PrintHistories
     * const printHistories = await prisma.printHistory.findMany()
     * 
     * // Get first 10 PrintHistories
     * const printHistories = await prisma.printHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const printHistoryWithIdOnly = await prisma.printHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PrintHistoryFindManyArgs>(args?: SelectSubset<T, PrintHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PrintHistory.
     * @param {PrintHistoryCreateArgs} args - Arguments to create a PrintHistory.
     * @example
     * // Create one PrintHistory
     * const PrintHistory = await prisma.printHistory.create({
     *   data: {
     *     // ... data to create a PrintHistory
     *   }
     * })
     * 
     */
    create<T extends PrintHistoryCreateArgs>(args: SelectSubset<T, PrintHistoryCreateArgs<ExtArgs>>): Prisma__PrintHistoryClient<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PrintHistories.
     * @param {PrintHistoryCreateManyArgs} args - Arguments to create many PrintHistories.
     * @example
     * // Create many PrintHistories
     * const printHistory = await prisma.printHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PrintHistoryCreateManyArgs>(args?: SelectSubset<T, PrintHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PrintHistories and returns the data saved in the database.
     * @param {PrintHistoryCreateManyAndReturnArgs} args - Arguments to create many PrintHistories.
     * @example
     * // Create many PrintHistories
     * const printHistory = await prisma.printHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PrintHistories and only return the `id`
     * const printHistoryWithIdOnly = await prisma.printHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PrintHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, PrintHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PrintHistory.
     * @param {PrintHistoryDeleteArgs} args - Arguments to delete one PrintHistory.
     * @example
     * // Delete one PrintHistory
     * const PrintHistory = await prisma.printHistory.delete({
     *   where: {
     *     // ... filter to delete one PrintHistory
     *   }
     * })
     * 
     */
    delete<T extends PrintHistoryDeleteArgs>(args: SelectSubset<T, PrintHistoryDeleteArgs<ExtArgs>>): Prisma__PrintHistoryClient<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PrintHistory.
     * @param {PrintHistoryUpdateArgs} args - Arguments to update one PrintHistory.
     * @example
     * // Update one PrintHistory
     * const printHistory = await prisma.printHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PrintHistoryUpdateArgs>(args: SelectSubset<T, PrintHistoryUpdateArgs<ExtArgs>>): Prisma__PrintHistoryClient<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PrintHistories.
     * @param {PrintHistoryDeleteManyArgs} args - Arguments to filter PrintHistories to delete.
     * @example
     * // Delete a few PrintHistories
     * const { count } = await prisma.printHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PrintHistoryDeleteManyArgs>(args?: SelectSubset<T, PrintHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PrintHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrintHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PrintHistories
     * const printHistory = await prisma.printHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PrintHistoryUpdateManyArgs>(args: SelectSubset<T, PrintHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PrintHistories and returns the data updated in the database.
     * @param {PrintHistoryUpdateManyAndReturnArgs} args - Arguments to update many PrintHistories.
     * @example
     * // Update many PrintHistories
     * const printHistory = await prisma.printHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PrintHistories and only return the `id`
     * const printHistoryWithIdOnly = await prisma.printHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PrintHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, PrintHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PrintHistory.
     * @param {PrintHistoryUpsertArgs} args - Arguments to update or create a PrintHistory.
     * @example
     * // Update or create a PrintHistory
     * const printHistory = await prisma.printHistory.upsert({
     *   create: {
     *     // ... data to create a PrintHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PrintHistory we want to update
     *   }
     * })
     */
    upsert<T extends PrintHistoryUpsertArgs>(args: SelectSubset<T, PrintHistoryUpsertArgs<ExtArgs>>): Prisma__PrintHistoryClient<$Result.GetResult<Prisma.$PrintHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PrintHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrintHistoryCountArgs} args - Arguments to filter PrintHistories to count.
     * @example
     * // Count the number of PrintHistories
     * const count = await prisma.printHistory.count({
     *   where: {
     *     // ... the filter for the PrintHistories we want to count
     *   }
     * })
    **/
    count<T extends PrintHistoryCountArgs>(
      args?: Subset<T, PrintHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PrintHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PrintHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrintHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PrintHistoryAggregateArgs>(args: Subset<T, PrintHistoryAggregateArgs>): Prisma.PrismaPromise<GetPrintHistoryAggregateType<T>>

    /**
     * Group by PrintHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrintHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PrintHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PrintHistoryGroupByArgs['orderBy'] }
        : { orderBy?: PrintHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PrintHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrintHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PrintHistory model
   */
  readonly fields: PrintHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PrintHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PrintHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    printer<T extends PrinterConfigDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PrinterConfigDefaultArgs<ExtArgs>>): Prisma__PrinterConfigClient<$Result.GetResult<Prisma.$PrinterConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PrintHistory model
   */
  interface PrintHistoryFieldRefs {
    readonly id: FieldRef<"PrintHistory", 'String'>
    readonly printerId: FieldRef<"PrintHistory", 'String'>
    readonly printType: FieldRef<"PrintHistory", 'String'>
    readonly orderId: FieldRef<"PrintHistory", 'String'>
    readonly tableName: FieldRef<"PrintHistory", 'String'>
    readonly status: FieldRef<"PrintHistory", 'String'>
    readonly retryCount: FieldRef<"PrintHistory", 'Int'>
    readonly error: FieldRef<"PrintHistory", 'String'>
    readonly createdAt: FieldRef<"PrintHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PrintHistory findUnique
   */
  export type PrintHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PrintHistory to fetch.
     */
    where: PrintHistoryWhereUniqueInput
  }

  /**
   * PrintHistory findUniqueOrThrow
   */
  export type PrintHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PrintHistory to fetch.
     */
    where: PrintHistoryWhereUniqueInput
  }

  /**
   * PrintHistory findFirst
   */
  export type PrintHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PrintHistory to fetch.
     */
    where?: PrintHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrintHistories to fetch.
     */
    orderBy?: PrintHistoryOrderByWithRelationInput | PrintHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrintHistories.
     */
    cursor?: PrintHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrintHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrintHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrintHistories.
     */
    distinct?: PrintHistoryScalarFieldEnum | PrintHistoryScalarFieldEnum[]
  }

  /**
   * PrintHistory findFirstOrThrow
   */
  export type PrintHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PrintHistory to fetch.
     */
    where?: PrintHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrintHistories to fetch.
     */
    orderBy?: PrintHistoryOrderByWithRelationInput | PrintHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrintHistories.
     */
    cursor?: PrintHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrintHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrintHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrintHistories.
     */
    distinct?: PrintHistoryScalarFieldEnum | PrintHistoryScalarFieldEnum[]
  }

  /**
   * PrintHistory findMany
   */
  export type PrintHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PrintHistories to fetch.
     */
    where?: PrintHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrintHistories to fetch.
     */
    orderBy?: PrintHistoryOrderByWithRelationInput | PrintHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PrintHistories.
     */
    cursor?: PrintHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrintHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrintHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrintHistories.
     */
    distinct?: PrintHistoryScalarFieldEnum | PrintHistoryScalarFieldEnum[]
  }

  /**
   * PrintHistory create
   */
  export type PrintHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a PrintHistory.
     */
    data: XOR<PrintHistoryCreateInput, PrintHistoryUncheckedCreateInput>
  }

  /**
   * PrintHistory createMany
   */
  export type PrintHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PrintHistories.
     */
    data: PrintHistoryCreateManyInput | PrintHistoryCreateManyInput[]
  }

  /**
   * PrintHistory createManyAndReturn
   */
  export type PrintHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many PrintHistories.
     */
    data: PrintHistoryCreateManyInput | PrintHistoryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PrintHistory update
   */
  export type PrintHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a PrintHistory.
     */
    data: XOR<PrintHistoryUpdateInput, PrintHistoryUncheckedUpdateInput>
    /**
     * Choose, which PrintHistory to update.
     */
    where: PrintHistoryWhereUniqueInput
  }

  /**
   * PrintHistory updateMany
   */
  export type PrintHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PrintHistories.
     */
    data: XOR<PrintHistoryUpdateManyMutationInput, PrintHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PrintHistories to update
     */
    where?: PrintHistoryWhereInput
    /**
     * Limit how many PrintHistories to update.
     */
    limit?: number
  }

  /**
   * PrintHistory updateManyAndReturn
   */
  export type PrintHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * The data used to update PrintHistories.
     */
    data: XOR<PrintHistoryUpdateManyMutationInput, PrintHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PrintHistories to update
     */
    where?: PrintHistoryWhereInput
    /**
     * Limit how many PrintHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PrintHistory upsert
   */
  export type PrintHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the PrintHistory to update in case it exists.
     */
    where: PrintHistoryWhereUniqueInput
    /**
     * In case the PrintHistory found by the `where` argument doesn't exist, create a new PrintHistory with this data.
     */
    create: XOR<PrintHistoryCreateInput, PrintHistoryUncheckedCreateInput>
    /**
     * In case the PrintHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PrintHistoryUpdateInput, PrintHistoryUncheckedUpdateInput>
  }

  /**
   * PrintHistory delete
   */
  export type PrintHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryInclude<ExtArgs> | null
    /**
     * Filter which PrintHistory to delete.
     */
    where: PrintHistoryWhereUniqueInput
  }

  /**
   * PrintHistory deleteMany
   */
  export type PrintHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrintHistories to delete
     */
    where?: PrintHistoryWhereInput
    /**
     * Limit how many PrintHistories to delete.
     */
    limit?: number
  }

  /**
   * PrintHistory without action
   */
  export type PrintHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrintHistory
     */
    select?: PrintHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrintHistory
     */
    omit?: PrintHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrintHistoryInclude<ExtArgs> | null
  }


  /**
   * Model LocalCredential
   */

  export type AggregateLocalCredential = {
    _count: LocalCredentialCountAggregateOutputType | null
    _min: LocalCredentialMinAggregateOutputType | null
    _max: LocalCredentialMaxAggregateOutputType | null
  }

  export type LocalCredentialMinAggregateOutputType = {
    id: string | null
    phone: string | null
    passwordHash: string | null
    pinHash: string | null
    name: string | null
    role: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalCredentialMaxAggregateOutputType = {
    id: string | null
    phone: string | null
    passwordHash: string | null
    pinHash: string | null
    name: string | null
    role: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocalCredentialCountAggregateOutputType = {
    id: number
    phone: number
    passwordHash: number
    pinHash: number
    name: number
    role: number
    imageUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocalCredentialMinAggregateInputType = {
    id?: true
    phone?: true
    passwordHash?: true
    pinHash?: true
    name?: true
    role?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalCredentialMaxAggregateInputType = {
    id?: true
    phone?: true
    passwordHash?: true
    pinHash?: true
    name?: true
    role?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocalCredentialCountAggregateInputType = {
    id?: true
    phone?: true
    passwordHash?: true
    pinHash?: true
    name?: true
    role?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocalCredentialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalCredential to aggregate.
     */
    where?: LocalCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCredentials to fetch.
     */
    orderBy?: LocalCredentialOrderByWithRelationInput | LocalCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalCredentials
    **/
    _count?: true | LocalCredentialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalCredentialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalCredentialMaxAggregateInputType
  }

  export type GetLocalCredentialAggregateType<T extends LocalCredentialAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalCredential]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalCredential[P]>
      : GetScalarType<T[P], AggregateLocalCredential[P]>
  }




  export type LocalCredentialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalCredentialWhereInput
    orderBy?: LocalCredentialOrderByWithAggregationInput | LocalCredentialOrderByWithAggregationInput[]
    by: LocalCredentialScalarFieldEnum[] | LocalCredentialScalarFieldEnum
    having?: LocalCredentialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalCredentialCountAggregateInputType | true
    _min?: LocalCredentialMinAggregateInputType
    _max?: LocalCredentialMaxAggregateInputType
  }

  export type LocalCredentialGroupByOutputType = {
    id: string
    phone: string
    passwordHash: string
    pinHash: string | null
    name: string
    role: string
    imageUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: LocalCredentialCountAggregateOutputType | null
    _min: LocalCredentialMinAggregateOutputType | null
    _max: LocalCredentialMaxAggregateOutputType | null
  }

  type GetLocalCredentialGroupByPayload<T extends LocalCredentialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalCredentialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalCredentialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalCredentialGroupByOutputType[P]>
            : GetScalarType<T[P], LocalCredentialGroupByOutputType[P]>
        }
      >
    >


  export type LocalCredentialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    passwordHash?: boolean
    pinHash?: boolean
    name?: boolean
    role?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localCredential"]>

  export type LocalCredentialSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    passwordHash?: boolean
    pinHash?: boolean
    name?: boolean
    role?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localCredential"]>

  export type LocalCredentialSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    passwordHash?: boolean
    pinHash?: boolean
    name?: boolean
    role?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localCredential"]>

  export type LocalCredentialSelectScalar = {
    id?: boolean
    phone?: boolean
    passwordHash?: boolean
    pinHash?: boolean
    name?: boolean
    role?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocalCredentialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone" | "passwordHash" | "pinHash" | "name" | "role" | "imageUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["localCredential"]>

  export type $LocalCredentialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalCredential"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phone: string
      passwordHash: string
      pinHash: string | null
      name: string
      role: string
      imageUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["localCredential"]>
    composites: {}
  }

  type LocalCredentialGetPayload<S extends boolean | null | undefined | LocalCredentialDefaultArgs> = $Result.GetResult<Prisma.$LocalCredentialPayload, S>

  type LocalCredentialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalCredentialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalCredentialCountAggregateInputType | true
    }

  export interface LocalCredentialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalCredential'], meta: { name: 'LocalCredential' } }
    /**
     * Find zero or one LocalCredential that matches the filter.
     * @param {LocalCredentialFindUniqueArgs} args - Arguments to find a LocalCredential
     * @example
     * // Get one LocalCredential
     * const localCredential = await prisma.localCredential.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalCredentialFindUniqueArgs>(args: SelectSubset<T, LocalCredentialFindUniqueArgs<ExtArgs>>): Prisma__LocalCredentialClient<$Result.GetResult<Prisma.$LocalCredentialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalCredential that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalCredentialFindUniqueOrThrowArgs} args - Arguments to find a LocalCredential
     * @example
     * // Get one LocalCredential
     * const localCredential = await prisma.localCredential.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalCredentialFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalCredentialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalCredentialClient<$Result.GetResult<Prisma.$LocalCredentialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalCredential that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCredentialFindFirstArgs} args - Arguments to find a LocalCredential
     * @example
     * // Get one LocalCredential
     * const localCredential = await prisma.localCredential.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalCredentialFindFirstArgs>(args?: SelectSubset<T, LocalCredentialFindFirstArgs<ExtArgs>>): Prisma__LocalCredentialClient<$Result.GetResult<Prisma.$LocalCredentialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalCredential that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCredentialFindFirstOrThrowArgs} args - Arguments to find a LocalCredential
     * @example
     * // Get one LocalCredential
     * const localCredential = await prisma.localCredential.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalCredentialFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalCredentialFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalCredentialClient<$Result.GetResult<Prisma.$LocalCredentialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalCredentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCredentialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalCredentials
     * const localCredentials = await prisma.localCredential.findMany()
     * 
     * // Get first 10 LocalCredentials
     * const localCredentials = await prisma.localCredential.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localCredentialWithIdOnly = await prisma.localCredential.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalCredentialFindManyArgs>(args?: SelectSubset<T, LocalCredentialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalCredentialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalCredential.
     * @param {LocalCredentialCreateArgs} args - Arguments to create a LocalCredential.
     * @example
     * // Create one LocalCredential
     * const LocalCredential = await prisma.localCredential.create({
     *   data: {
     *     // ... data to create a LocalCredential
     *   }
     * })
     * 
     */
    create<T extends LocalCredentialCreateArgs>(args: SelectSubset<T, LocalCredentialCreateArgs<ExtArgs>>): Prisma__LocalCredentialClient<$Result.GetResult<Prisma.$LocalCredentialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalCredentials.
     * @param {LocalCredentialCreateManyArgs} args - Arguments to create many LocalCredentials.
     * @example
     * // Create many LocalCredentials
     * const localCredential = await prisma.localCredential.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalCredentialCreateManyArgs>(args?: SelectSubset<T, LocalCredentialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalCredentials and returns the data saved in the database.
     * @param {LocalCredentialCreateManyAndReturnArgs} args - Arguments to create many LocalCredentials.
     * @example
     * // Create many LocalCredentials
     * const localCredential = await prisma.localCredential.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalCredentials and only return the `id`
     * const localCredentialWithIdOnly = await prisma.localCredential.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalCredentialCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalCredentialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalCredentialPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalCredential.
     * @param {LocalCredentialDeleteArgs} args - Arguments to delete one LocalCredential.
     * @example
     * // Delete one LocalCredential
     * const LocalCredential = await prisma.localCredential.delete({
     *   where: {
     *     // ... filter to delete one LocalCredential
     *   }
     * })
     * 
     */
    delete<T extends LocalCredentialDeleteArgs>(args: SelectSubset<T, LocalCredentialDeleteArgs<ExtArgs>>): Prisma__LocalCredentialClient<$Result.GetResult<Prisma.$LocalCredentialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalCredential.
     * @param {LocalCredentialUpdateArgs} args - Arguments to update one LocalCredential.
     * @example
     * // Update one LocalCredential
     * const localCredential = await prisma.localCredential.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalCredentialUpdateArgs>(args: SelectSubset<T, LocalCredentialUpdateArgs<ExtArgs>>): Prisma__LocalCredentialClient<$Result.GetResult<Prisma.$LocalCredentialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalCredentials.
     * @param {LocalCredentialDeleteManyArgs} args - Arguments to filter LocalCredentials to delete.
     * @example
     * // Delete a few LocalCredentials
     * const { count } = await prisma.localCredential.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalCredentialDeleteManyArgs>(args?: SelectSubset<T, LocalCredentialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCredentialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalCredentials
     * const localCredential = await prisma.localCredential.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalCredentialUpdateManyArgs>(args: SelectSubset<T, LocalCredentialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalCredentials and returns the data updated in the database.
     * @param {LocalCredentialUpdateManyAndReturnArgs} args - Arguments to update many LocalCredentials.
     * @example
     * // Update many LocalCredentials
     * const localCredential = await prisma.localCredential.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalCredentials and only return the `id`
     * const localCredentialWithIdOnly = await prisma.localCredential.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalCredentialUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalCredentialUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalCredentialPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalCredential.
     * @param {LocalCredentialUpsertArgs} args - Arguments to update or create a LocalCredential.
     * @example
     * // Update or create a LocalCredential
     * const localCredential = await prisma.localCredential.upsert({
     *   create: {
     *     // ... data to create a LocalCredential
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalCredential we want to update
     *   }
     * })
     */
    upsert<T extends LocalCredentialUpsertArgs>(args: SelectSubset<T, LocalCredentialUpsertArgs<ExtArgs>>): Prisma__LocalCredentialClient<$Result.GetResult<Prisma.$LocalCredentialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCredentialCountArgs} args - Arguments to filter LocalCredentials to count.
     * @example
     * // Count the number of LocalCredentials
     * const count = await prisma.localCredential.count({
     *   where: {
     *     // ... the filter for the LocalCredentials we want to count
     *   }
     * })
    **/
    count<T extends LocalCredentialCountArgs>(
      args?: Subset<T, LocalCredentialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalCredentialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalCredential.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCredentialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalCredentialAggregateArgs>(args: Subset<T, LocalCredentialAggregateArgs>): Prisma.PrismaPromise<GetLocalCredentialAggregateType<T>>

    /**
     * Group by LocalCredential.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCredentialGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalCredentialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalCredentialGroupByArgs['orderBy'] }
        : { orderBy?: LocalCredentialGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalCredentialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalCredentialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalCredential model
   */
  readonly fields: LocalCredentialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalCredential.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalCredentialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalCredential model
   */
  interface LocalCredentialFieldRefs {
    readonly id: FieldRef<"LocalCredential", 'String'>
    readonly phone: FieldRef<"LocalCredential", 'String'>
    readonly passwordHash: FieldRef<"LocalCredential", 'String'>
    readonly pinHash: FieldRef<"LocalCredential", 'String'>
    readonly name: FieldRef<"LocalCredential", 'String'>
    readonly role: FieldRef<"LocalCredential", 'String'>
    readonly imageUrl: FieldRef<"LocalCredential", 'String'>
    readonly createdAt: FieldRef<"LocalCredential", 'DateTime'>
    readonly updatedAt: FieldRef<"LocalCredential", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocalCredential findUnique
   */
  export type LocalCredentialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
    /**
     * Filter, which LocalCredential to fetch.
     */
    where: LocalCredentialWhereUniqueInput
  }

  /**
   * LocalCredential findUniqueOrThrow
   */
  export type LocalCredentialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
    /**
     * Filter, which LocalCredential to fetch.
     */
    where: LocalCredentialWhereUniqueInput
  }

  /**
   * LocalCredential findFirst
   */
  export type LocalCredentialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
    /**
     * Filter, which LocalCredential to fetch.
     */
    where?: LocalCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCredentials to fetch.
     */
    orderBy?: LocalCredentialOrderByWithRelationInput | LocalCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalCredentials.
     */
    cursor?: LocalCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalCredentials.
     */
    distinct?: LocalCredentialScalarFieldEnum | LocalCredentialScalarFieldEnum[]
  }

  /**
   * LocalCredential findFirstOrThrow
   */
  export type LocalCredentialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
    /**
     * Filter, which LocalCredential to fetch.
     */
    where?: LocalCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCredentials to fetch.
     */
    orderBy?: LocalCredentialOrderByWithRelationInput | LocalCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalCredentials.
     */
    cursor?: LocalCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalCredentials.
     */
    distinct?: LocalCredentialScalarFieldEnum | LocalCredentialScalarFieldEnum[]
  }

  /**
   * LocalCredential findMany
   */
  export type LocalCredentialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
    /**
     * Filter, which LocalCredentials to fetch.
     */
    where?: LocalCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCredentials to fetch.
     */
    orderBy?: LocalCredentialOrderByWithRelationInput | LocalCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalCredentials.
     */
    cursor?: LocalCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalCredentials.
     */
    distinct?: LocalCredentialScalarFieldEnum | LocalCredentialScalarFieldEnum[]
  }

  /**
   * LocalCredential create
   */
  export type LocalCredentialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
    /**
     * The data needed to create a LocalCredential.
     */
    data: XOR<LocalCredentialCreateInput, LocalCredentialUncheckedCreateInput>
  }

  /**
   * LocalCredential createMany
   */
  export type LocalCredentialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalCredentials.
     */
    data: LocalCredentialCreateManyInput | LocalCredentialCreateManyInput[]
  }

  /**
   * LocalCredential createManyAndReturn
   */
  export type LocalCredentialCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
    /**
     * The data used to create many LocalCredentials.
     */
    data: LocalCredentialCreateManyInput | LocalCredentialCreateManyInput[]
  }

  /**
   * LocalCredential update
   */
  export type LocalCredentialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
    /**
     * The data needed to update a LocalCredential.
     */
    data: XOR<LocalCredentialUpdateInput, LocalCredentialUncheckedUpdateInput>
    /**
     * Choose, which LocalCredential to update.
     */
    where: LocalCredentialWhereUniqueInput
  }

  /**
   * LocalCredential updateMany
   */
  export type LocalCredentialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalCredentials.
     */
    data: XOR<LocalCredentialUpdateManyMutationInput, LocalCredentialUncheckedUpdateManyInput>
    /**
     * Filter which LocalCredentials to update
     */
    where?: LocalCredentialWhereInput
    /**
     * Limit how many LocalCredentials to update.
     */
    limit?: number
  }

  /**
   * LocalCredential updateManyAndReturn
   */
  export type LocalCredentialUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
    /**
     * The data used to update LocalCredentials.
     */
    data: XOR<LocalCredentialUpdateManyMutationInput, LocalCredentialUncheckedUpdateManyInput>
    /**
     * Filter which LocalCredentials to update
     */
    where?: LocalCredentialWhereInput
    /**
     * Limit how many LocalCredentials to update.
     */
    limit?: number
  }

  /**
   * LocalCredential upsert
   */
  export type LocalCredentialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
    /**
     * The filter to search for the LocalCredential to update in case it exists.
     */
    where: LocalCredentialWhereUniqueInput
    /**
     * In case the LocalCredential found by the `where` argument doesn't exist, create a new LocalCredential with this data.
     */
    create: XOR<LocalCredentialCreateInput, LocalCredentialUncheckedCreateInput>
    /**
     * In case the LocalCredential was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalCredentialUpdateInput, LocalCredentialUncheckedUpdateInput>
  }

  /**
   * LocalCredential delete
   */
  export type LocalCredentialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
    /**
     * Filter which LocalCredential to delete.
     */
    where: LocalCredentialWhereUniqueInput
  }

  /**
   * LocalCredential deleteMany
   */
  export type LocalCredentialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalCredentials to delete
     */
    where?: LocalCredentialWhereInput
    /**
     * Limit how many LocalCredentials to delete.
     */
    limit?: number
  }

  /**
   * LocalCredential without action
   */
  export type LocalCredentialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCredential
     */
    select?: LocalCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCredential
     */
    omit?: LocalCredentialOmit<ExtArgs> | null
  }


  /**
   * Model CachedTable
   */

  export type AggregateCachedTable = {
    _count: CachedTableCountAggregateOutputType | null
    _avg: CachedTableAvgAggregateOutputType | null
    _sum: CachedTableSumAggregateOutputType | null
    _min: CachedTableMinAggregateOutputType | null
    _max: CachedTableMaxAggregateOutputType | null
  }

  export type CachedTableAvgAggregateOutputType = {
    capacity: number | null
  }

  export type CachedTableSumAggregateOutputType = {
    capacity: number | null
  }

  export type CachedTableMinAggregateOutputType = {
    id: string | null
    name: string | null
    areaId: string | null
    areaName: string | null
    capacity: number | null
    status: string | null
  }

  export type CachedTableMaxAggregateOutputType = {
    id: string | null
    name: string | null
    areaId: string | null
    areaName: string | null
    capacity: number | null
    status: string | null
  }

  export type CachedTableCountAggregateOutputType = {
    id: number
    name: number
    areaId: number
    areaName: number
    capacity: number
    status: number
    _all: number
  }


  export type CachedTableAvgAggregateInputType = {
    capacity?: true
  }

  export type CachedTableSumAggregateInputType = {
    capacity?: true
  }

  export type CachedTableMinAggregateInputType = {
    id?: true
    name?: true
    areaId?: true
    areaName?: true
    capacity?: true
    status?: true
  }

  export type CachedTableMaxAggregateInputType = {
    id?: true
    name?: true
    areaId?: true
    areaName?: true
    capacity?: true
    status?: true
  }

  export type CachedTableCountAggregateInputType = {
    id?: true
    name?: true
    areaId?: true
    areaName?: true
    capacity?: true
    status?: true
    _all?: true
  }

  export type CachedTableAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedTable to aggregate.
     */
    where?: CachedTableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedTables to fetch.
     */
    orderBy?: CachedTableOrderByWithRelationInput | CachedTableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CachedTableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedTables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedTables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CachedTables
    **/
    _count?: true | CachedTableCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CachedTableAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CachedTableSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CachedTableMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CachedTableMaxAggregateInputType
  }

  export type GetCachedTableAggregateType<T extends CachedTableAggregateArgs> = {
        [P in keyof T & keyof AggregateCachedTable]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCachedTable[P]>
      : GetScalarType<T[P], AggregateCachedTable[P]>
  }




  export type CachedTableGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CachedTableWhereInput
    orderBy?: CachedTableOrderByWithAggregationInput | CachedTableOrderByWithAggregationInput[]
    by: CachedTableScalarFieldEnum[] | CachedTableScalarFieldEnum
    having?: CachedTableScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CachedTableCountAggregateInputType | true
    _avg?: CachedTableAvgAggregateInputType
    _sum?: CachedTableSumAggregateInputType
    _min?: CachedTableMinAggregateInputType
    _max?: CachedTableMaxAggregateInputType
  }

  export type CachedTableGroupByOutputType = {
    id: string
    name: string
    areaId: string | null
    areaName: string | null
    capacity: number
    status: string
    _count: CachedTableCountAggregateOutputType | null
    _avg: CachedTableAvgAggregateOutputType | null
    _sum: CachedTableSumAggregateOutputType | null
    _min: CachedTableMinAggregateOutputType | null
    _max: CachedTableMaxAggregateOutputType | null
  }

  type GetCachedTableGroupByPayload<T extends CachedTableGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CachedTableGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CachedTableGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CachedTableGroupByOutputType[P]>
            : GetScalarType<T[P], CachedTableGroupByOutputType[P]>
        }
      >
    >


  export type CachedTableSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    areaId?: boolean
    areaName?: boolean
    capacity?: boolean
    status?: boolean
  }, ExtArgs["result"]["cachedTable"]>

  export type CachedTableSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    areaId?: boolean
    areaName?: boolean
    capacity?: boolean
    status?: boolean
  }, ExtArgs["result"]["cachedTable"]>

  export type CachedTableSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    areaId?: boolean
    areaName?: boolean
    capacity?: boolean
    status?: boolean
  }, ExtArgs["result"]["cachedTable"]>

  export type CachedTableSelectScalar = {
    id?: boolean
    name?: boolean
    areaId?: boolean
    areaName?: boolean
    capacity?: boolean
    status?: boolean
  }

  export type CachedTableOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "areaId" | "areaName" | "capacity" | "status", ExtArgs["result"]["cachedTable"]>

  export type $CachedTablePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CachedTable"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      areaId: string | null
      areaName: string | null
      capacity: number
      status: string
    }, ExtArgs["result"]["cachedTable"]>
    composites: {}
  }

  type CachedTableGetPayload<S extends boolean | null | undefined | CachedTableDefaultArgs> = $Result.GetResult<Prisma.$CachedTablePayload, S>

  type CachedTableCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CachedTableFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CachedTableCountAggregateInputType | true
    }

  export interface CachedTableDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CachedTable'], meta: { name: 'CachedTable' } }
    /**
     * Find zero or one CachedTable that matches the filter.
     * @param {CachedTableFindUniqueArgs} args - Arguments to find a CachedTable
     * @example
     * // Get one CachedTable
     * const cachedTable = await prisma.cachedTable.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CachedTableFindUniqueArgs>(args: SelectSubset<T, CachedTableFindUniqueArgs<ExtArgs>>): Prisma__CachedTableClient<$Result.GetResult<Prisma.$CachedTablePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CachedTable that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CachedTableFindUniqueOrThrowArgs} args - Arguments to find a CachedTable
     * @example
     * // Get one CachedTable
     * const cachedTable = await prisma.cachedTable.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CachedTableFindUniqueOrThrowArgs>(args: SelectSubset<T, CachedTableFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CachedTableClient<$Result.GetResult<Prisma.$CachedTablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedTable that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedTableFindFirstArgs} args - Arguments to find a CachedTable
     * @example
     * // Get one CachedTable
     * const cachedTable = await prisma.cachedTable.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CachedTableFindFirstArgs>(args?: SelectSubset<T, CachedTableFindFirstArgs<ExtArgs>>): Prisma__CachedTableClient<$Result.GetResult<Prisma.$CachedTablePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedTable that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedTableFindFirstOrThrowArgs} args - Arguments to find a CachedTable
     * @example
     * // Get one CachedTable
     * const cachedTable = await prisma.cachedTable.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CachedTableFindFirstOrThrowArgs>(args?: SelectSubset<T, CachedTableFindFirstOrThrowArgs<ExtArgs>>): Prisma__CachedTableClient<$Result.GetResult<Prisma.$CachedTablePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CachedTables that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedTableFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CachedTables
     * const cachedTables = await prisma.cachedTable.findMany()
     * 
     * // Get first 10 CachedTables
     * const cachedTables = await prisma.cachedTable.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cachedTableWithIdOnly = await prisma.cachedTable.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CachedTableFindManyArgs>(args?: SelectSubset<T, CachedTableFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedTablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CachedTable.
     * @param {CachedTableCreateArgs} args - Arguments to create a CachedTable.
     * @example
     * // Create one CachedTable
     * const CachedTable = await prisma.cachedTable.create({
     *   data: {
     *     // ... data to create a CachedTable
     *   }
     * })
     * 
     */
    create<T extends CachedTableCreateArgs>(args: SelectSubset<T, CachedTableCreateArgs<ExtArgs>>): Prisma__CachedTableClient<$Result.GetResult<Prisma.$CachedTablePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CachedTables.
     * @param {CachedTableCreateManyArgs} args - Arguments to create many CachedTables.
     * @example
     * // Create many CachedTables
     * const cachedTable = await prisma.cachedTable.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CachedTableCreateManyArgs>(args?: SelectSubset<T, CachedTableCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CachedTables and returns the data saved in the database.
     * @param {CachedTableCreateManyAndReturnArgs} args - Arguments to create many CachedTables.
     * @example
     * // Create many CachedTables
     * const cachedTable = await prisma.cachedTable.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CachedTables and only return the `id`
     * const cachedTableWithIdOnly = await prisma.cachedTable.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CachedTableCreateManyAndReturnArgs>(args?: SelectSubset<T, CachedTableCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedTablePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CachedTable.
     * @param {CachedTableDeleteArgs} args - Arguments to delete one CachedTable.
     * @example
     * // Delete one CachedTable
     * const CachedTable = await prisma.cachedTable.delete({
     *   where: {
     *     // ... filter to delete one CachedTable
     *   }
     * })
     * 
     */
    delete<T extends CachedTableDeleteArgs>(args: SelectSubset<T, CachedTableDeleteArgs<ExtArgs>>): Prisma__CachedTableClient<$Result.GetResult<Prisma.$CachedTablePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CachedTable.
     * @param {CachedTableUpdateArgs} args - Arguments to update one CachedTable.
     * @example
     * // Update one CachedTable
     * const cachedTable = await prisma.cachedTable.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CachedTableUpdateArgs>(args: SelectSubset<T, CachedTableUpdateArgs<ExtArgs>>): Prisma__CachedTableClient<$Result.GetResult<Prisma.$CachedTablePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CachedTables.
     * @param {CachedTableDeleteManyArgs} args - Arguments to filter CachedTables to delete.
     * @example
     * // Delete a few CachedTables
     * const { count } = await prisma.cachedTable.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CachedTableDeleteManyArgs>(args?: SelectSubset<T, CachedTableDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedTables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedTableUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CachedTables
     * const cachedTable = await prisma.cachedTable.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CachedTableUpdateManyArgs>(args: SelectSubset<T, CachedTableUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedTables and returns the data updated in the database.
     * @param {CachedTableUpdateManyAndReturnArgs} args - Arguments to update many CachedTables.
     * @example
     * // Update many CachedTables
     * const cachedTable = await prisma.cachedTable.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CachedTables and only return the `id`
     * const cachedTableWithIdOnly = await prisma.cachedTable.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CachedTableUpdateManyAndReturnArgs>(args: SelectSubset<T, CachedTableUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedTablePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CachedTable.
     * @param {CachedTableUpsertArgs} args - Arguments to update or create a CachedTable.
     * @example
     * // Update or create a CachedTable
     * const cachedTable = await prisma.cachedTable.upsert({
     *   create: {
     *     // ... data to create a CachedTable
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CachedTable we want to update
     *   }
     * })
     */
    upsert<T extends CachedTableUpsertArgs>(args: SelectSubset<T, CachedTableUpsertArgs<ExtArgs>>): Prisma__CachedTableClient<$Result.GetResult<Prisma.$CachedTablePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CachedTables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedTableCountArgs} args - Arguments to filter CachedTables to count.
     * @example
     * // Count the number of CachedTables
     * const count = await prisma.cachedTable.count({
     *   where: {
     *     // ... the filter for the CachedTables we want to count
     *   }
     * })
    **/
    count<T extends CachedTableCountArgs>(
      args?: Subset<T, CachedTableCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CachedTableCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CachedTable.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedTableAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CachedTableAggregateArgs>(args: Subset<T, CachedTableAggregateArgs>): Prisma.PrismaPromise<GetCachedTableAggregateType<T>>

    /**
     * Group by CachedTable.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedTableGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CachedTableGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CachedTableGroupByArgs['orderBy'] }
        : { orderBy?: CachedTableGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CachedTableGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCachedTableGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CachedTable model
   */
  readonly fields: CachedTableFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CachedTable.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CachedTableClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CachedTable model
   */
  interface CachedTableFieldRefs {
    readonly id: FieldRef<"CachedTable", 'String'>
    readonly name: FieldRef<"CachedTable", 'String'>
    readonly areaId: FieldRef<"CachedTable", 'String'>
    readonly areaName: FieldRef<"CachedTable", 'String'>
    readonly capacity: FieldRef<"CachedTable", 'Int'>
    readonly status: FieldRef<"CachedTable", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CachedTable findUnique
   */
  export type CachedTableFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
    /**
     * Filter, which CachedTable to fetch.
     */
    where: CachedTableWhereUniqueInput
  }

  /**
   * CachedTable findUniqueOrThrow
   */
  export type CachedTableFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
    /**
     * Filter, which CachedTable to fetch.
     */
    where: CachedTableWhereUniqueInput
  }

  /**
   * CachedTable findFirst
   */
  export type CachedTableFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
    /**
     * Filter, which CachedTable to fetch.
     */
    where?: CachedTableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedTables to fetch.
     */
    orderBy?: CachedTableOrderByWithRelationInput | CachedTableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedTables.
     */
    cursor?: CachedTableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedTables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedTables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedTables.
     */
    distinct?: CachedTableScalarFieldEnum | CachedTableScalarFieldEnum[]
  }

  /**
   * CachedTable findFirstOrThrow
   */
  export type CachedTableFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
    /**
     * Filter, which CachedTable to fetch.
     */
    where?: CachedTableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedTables to fetch.
     */
    orderBy?: CachedTableOrderByWithRelationInput | CachedTableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedTables.
     */
    cursor?: CachedTableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedTables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedTables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedTables.
     */
    distinct?: CachedTableScalarFieldEnum | CachedTableScalarFieldEnum[]
  }

  /**
   * CachedTable findMany
   */
  export type CachedTableFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
    /**
     * Filter, which CachedTables to fetch.
     */
    where?: CachedTableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedTables to fetch.
     */
    orderBy?: CachedTableOrderByWithRelationInput | CachedTableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CachedTables.
     */
    cursor?: CachedTableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedTables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedTables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedTables.
     */
    distinct?: CachedTableScalarFieldEnum | CachedTableScalarFieldEnum[]
  }

  /**
   * CachedTable create
   */
  export type CachedTableCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
    /**
     * The data needed to create a CachedTable.
     */
    data: XOR<CachedTableCreateInput, CachedTableUncheckedCreateInput>
  }

  /**
   * CachedTable createMany
   */
  export type CachedTableCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CachedTables.
     */
    data: CachedTableCreateManyInput | CachedTableCreateManyInput[]
  }

  /**
   * CachedTable createManyAndReturn
   */
  export type CachedTableCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
    /**
     * The data used to create many CachedTables.
     */
    data: CachedTableCreateManyInput | CachedTableCreateManyInput[]
  }

  /**
   * CachedTable update
   */
  export type CachedTableUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
    /**
     * The data needed to update a CachedTable.
     */
    data: XOR<CachedTableUpdateInput, CachedTableUncheckedUpdateInput>
    /**
     * Choose, which CachedTable to update.
     */
    where: CachedTableWhereUniqueInput
  }

  /**
   * CachedTable updateMany
   */
  export type CachedTableUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CachedTables.
     */
    data: XOR<CachedTableUpdateManyMutationInput, CachedTableUncheckedUpdateManyInput>
    /**
     * Filter which CachedTables to update
     */
    where?: CachedTableWhereInput
    /**
     * Limit how many CachedTables to update.
     */
    limit?: number
  }

  /**
   * CachedTable updateManyAndReturn
   */
  export type CachedTableUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
    /**
     * The data used to update CachedTables.
     */
    data: XOR<CachedTableUpdateManyMutationInput, CachedTableUncheckedUpdateManyInput>
    /**
     * Filter which CachedTables to update
     */
    where?: CachedTableWhereInput
    /**
     * Limit how many CachedTables to update.
     */
    limit?: number
  }

  /**
   * CachedTable upsert
   */
  export type CachedTableUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
    /**
     * The filter to search for the CachedTable to update in case it exists.
     */
    where: CachedTableWhereUniqueInput
    /**
     * In case the CachedTable found by the `where` argument doesn't exist, create a new CachedTable with this data.
     */
    create: XOR<CachedTableCreateInput, CachedTableUncheckedCreateInput>
    /**
     * In case the CachedTable was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CachedTableUpdateInput, CachedTableUncheckedUpdateInput>
  }

  /**
   * CachedTable delete
   */
  export type CachedTableDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
    /**
     * Filter which CachedTable to delete.
     */
    where: CachedTableWhereUniqueInput
  }

  /**
   * CachedTable deleteMany
   */
  export type CachedTableDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedTables to delete
     */
    where?: CachedTableWhereInput
    /**
     * Limit how many CachedTables to delete.
     */
    limit?: number
  }

  /**
   * CachedTable without action
   */
  export type CachedTableDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedTable
     */
    select?: CachedTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedTable
     */
    omit?: CachedTableOmit<ExtArgs> | null
  }


  /**
   * Model CachedCategory
   */

  export type AggregateCachedCategory = {
    _count: CachedCategoryCountAggregateOutputType | null
    _avg: CachedCategoryAvgAggregateOutputType | null
    _sum: CachedCategorySumAggregateOutputType | null
    _min: CachedCategoryMinAggregateOutputType | null
    _max: CachedCategoryMaxAggregateOutputType | null
  }

  export type CachedCategoryAvgAggregateOutputType = {
    displayOrder: number | null
  }

  export type CachedCategorySumAggregateOutputType = {
    displayOrder: number | null
  }

  export type CachedCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    displayOrder: number | null
    imageUrl: string | null
    kitchenId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CachedCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    displayOrder: number | null
    imageUrl: string | null
    kitchenId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CachedCategoryCountAggregateOutputType = {
    id: number
    name: number
    displayOrder: number
    imageUrl: number
    kitchenId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CachedCategoryAvgAggregateInputType = {
    displayOrder?: true
  }

  export type CachedCategorySumAggregateInputType = {
    displayOrder?: true
  }

  export type CachedCategoryMinAggregateInputType = {
    id?: true
    name?: true
    displayOrder?: true
    imageUrl?: true
    kitchenId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CachedCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    displayOrder?: true
    imageUrl?: true
    kitchenId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CachedCategoryCountAggregateInputType = {
    id?: true
    name?: true
    displayOrder?: true
    imageUrl?: true
    kitchenId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CachedCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedCategory to aggregate.
     */
    where?: CachedCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedCategories to fetch.
     */
    orderBy?: CachedCategoryOrderByWithRelationInput | CachedCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CachedCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CachedCategories
    **/
    _count?: true | CachedCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CachedCategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CachedCategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CachedCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CachedCategoryMaxAggregateInputType
  }

  export type GetCachedCategoryAggregateType<T extends CachedCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCachedCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCachedCategory[P]>
      : GetScalarType<T[P], AggregateCachedCategory[P]>
  }




  export type CachedCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CachedCategoryWhereInput
    orderBy?: CachedCategoryOrderByWithAggregationInput | CachedCategoryOrderByWithAggregationInput[]
    by: CachedCategoryScalarFieldEnum[] | CachedCategoryScalarFieldEnum
    having?: CachedCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CachedCategoryCountAggregateInputType | true
    _avg?: CachedCategoryAvgAggregateInputType
    _sum?: CachedCategorySumAggregateInputType
    _min?: CachedCategoryMinAggregateInputType
    _max?: CachedCategoryMaxAggregateInputType
  }

  export type CachedCategoryGroupByOutputType = {
    id: string
    name: string
    displayOrder: number
    imageUrl: string | null
    kitchenId: string | null
    createdAt: Date
    updatedAt: Date
    _count: CachedCategoryCountAggregateOutputType | null
    _avg: CachedCategoryAvgAggregateOutputType | null
    _sum: CachedCategorySumAggregateOutputType | null
    _min: CachedCategoryMinAggregateOutputType | null
    _max: CachedCategoryMaxAggregateOutputType | null
  }

  type GetCachedCategoryGroupByPayload<T extends CachedCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CachedCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CachedCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CachedCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CachedCategoryGroupByOutputType[P]>
        }
      >
    >


  export type CachedCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayOrder?: boolean
    imageUrl?: boolean
    kitchenId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cachedCategory"]>

  export type CachedCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayOrder?: boolean
    imageUrl?: boolean
    kitchenId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cachedCategory"]>

  export type CachedCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayOrder?: boolean
    imageUrl?: boolean
    kitchenId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cachedCategory"]>

  export type CachedCategorySelectScalar = {
    id?: boolean
    name?: boolean
    displayOrder?: boolean
    imageUrl?: boolean
    kitchenId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CachedCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "displayOrder" | "imageUrl" | "kitchenId" | "createdAt" | "updatedAt", ExtArgs["result"]["cachedCategory"]>

  export type $CachedCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CachedCategory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      displayOrder: number
      imageUrl: string | null
      kitchenId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cachedCategory"]>
    composites: {}
  }

  type CachedCategoryGetPayload<S extends boolean | null | undefined | CachedCategoryDefaultArgs> = $Result.GetResult<Prisma.$CachedCategoryPayload, S>

  type CachedCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CachedCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CachedCategoryCountAggregateInputType | true
    }

  export interface CachedCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CachedCategory'], meta: { name: 'CachedCategory' } }
    /**
     * Find zero or one CachedCategory that matches the filter.
     * @param {CachedCategoryFindUniqueArgs} args - Arguments to find a CachedCategory
     * @example
     * // Get one CachedCategory
     * const cachedCategory = await prisma.cachedCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CachedCategoryFindUniqueArgs>(args: SelectSubset<T, CachedCategoryFindUniqueArgs<ExtArgs>>): Prisma__CachedCategoryClient<$Result.GetResult<Prisma.$CachedCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CachedCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CachedCategoryFindUniqueOrThrowArgs} args - Arguments to find a CachedCategory
     * @example
     * // Get one CachedCategory
     * const cachedCategory = await prisma.cachedCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CachedCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CachedCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CachedCategoryClient<$Result.GetResult<Prisma.$CachedCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedCategoryFindFirstArgs} args - Arguments to find a CachedCategory
     * @example
     * // Get one CachedCategory
     * const cachedCategory = await prisma.cachedCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CachedCategoryFindFirstArgs>(args?: SelectSubset<T, CachedCategoryFindFirstArgs<ExtArgs>>): Prisma__CachedCategoryClient<$Result.GetResult<Prisma.$CachedCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedCategoryFindFirstOrThrowArgs} args - Arguments to find a CachedCategory
     * @example
     * // Get one CachedCategory
     * const cachedCategory = await prisma.cachedCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CachedCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CachedCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CachedCategoryClient<$Result.GetResult<Prisma.$CachedCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CachedCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CachedCategories
     * const cachedCategories = await prisma.cachedCategory.findMany()
     * 
     * // Get first 10 CachedCategories
     * const cachedCategories = await prisma.cachedCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cachedCategoryWithIdOnly = await prisma.cachedCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CachedCategoryFindManyArgs>(args?: SelectSubset<T, CachedCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CachedCategory.
     * @param {CachedCategoryCreateArgs} args - Arguments to create a CachedCategory.
     * @example
     * // Create one CachedCategory
     * const CachedCategory = await prisma.cachedCategory.create({
     *   data: {
     *     // ... data to create a CachedCategory
     *   }
     * })
     * 
     */
    create<T extends CachedCategoryCreateArgs>(args: SelectSubset<T, CachedCategoryCreateArgs<ExtArgs>>): Prisma__CachedCategoryClient<$Result.GetResult<Prisma.$CachedCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CachedCategories.
     * @param {CachedCategoryCreateManyArgs} args - Arguments to create many CachedCategories.
     * @example
     * // Create many CachedCategories
     * const cachedCategory = await prisma.cachedCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CachedCategoryCreateManyArgs>(args?: SelectSubset<T, CachedCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CachedCategories and returns the data saved in the database.
     * @param {CachedCategoryCreateManyAndReturnArgs} args - Arguments to create many CachedCategories.
     * @example
     * // Create many CachedCategories
     * const cachedCategory = await prisma.cachedCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CachedCategories and only return the `id`
     * const cachedCategoryWithIdOnly = await prisma.cachedCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CachedCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CachedCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CachedCategory.
     * @param {CachedCategoryDeleteArgs} args - Arguments to delete one CachedCategory.
     * @example
     * // Delete one CachedCategory
     * const CachedCategory = await prisma.cachedCategory.delete({
     *   where: {
     *     // ... filter to delete one CachedCategory
     *   }
     * })
     * 
     */
    delete<T extends CachedCategoryDeleteArgs>(args: SelectSubset<T, CachedCategoryDeleteArgs<ExtArgs>>): Prisma__CachedCategoryClient<$Result.GetResult<Prisma.$CachedCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CachedCategory.
     * @param {CachedCategoryUpdateArgs} args - Arguments to update one CachedCategory.
     * @example
     * // Update one CachedCategory
     * const cachedCategory = await prisma.cachedCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CachedCategoryUpdateArgs>(args: SelectSubset<T, CachedCategoryUpdateArgs<ExtArgs>>): Prisma__CachedCategoryClient<$Result.GetResult<Prisma.$CachedCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CachedCategories.
     * @param {CachedCategoryDeleteManyArgs} args - Arguments to filter CachedCategories to delete.
     * @example
     * // Delete a few CachedCategories
     * const { count } = await prisma.cachedCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CachedCategoryDeleteManyArgs>(args?: SelectSubset<T, CachedCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CachedCategories
     * const cachedCategory = await prisma.cachedCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CachedCategoryUpdateManyArgs>(args: SelectSubset<T, CachedCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedCategories and returns the data updated in the database.
     * @param {CachedCategoryUpdateManyAndReturnArgs} args - Arguments to update many CachedCategories.
     * @example
     * // Update many CachedCategories
     * const cachedCategory = await prisma.cachedCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CachedCategories and only return the `id`
     * const cachedCategoryWithIdOnly = await prisma.cachedCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CachedCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CachedCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CachedCategory.
     * @param {CachedCategoryUpsertArgs} args - Arguments to update or create a CachedCategory.
     * @example
     * // Update or create a CachedCategory
     * const cachedCategory = await prisma.cachedCategory.upsert({
     *   create: {
     *     // ... data to create a CachedCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CachedCategory we want to update
     *   }
     * })
     */
    upsert<T extends CachedCategoryUpsertArgs>(args: SelectSubset<T, CachedCategoryUpsertArgs<ExtArgs>>): Prisma__CachedCategoryClient<$Result.GetResult<Prisma.$CachedCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CachedCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedCategoryCountArgs} args - Arguments to filter CachedCategories to count.
     * @example
     * // Count the number of CachedCategories
     * const count = await prisma.cachedCategory.count({
     *   where: {
     *     // ... the filter for the CachedCategories we want to count
     *   }
     * })
    **/
    count<T extends CachedCategoryCountArgs>(
      args?: Subset<T, CachedCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CachedCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CachedCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CachedCategoryAggregateArgs>(args: Subset<T, CachedCategoryAggregateArgs>): Prisma.PrismaPromise<GetCachedCategoryAggregateType<T>>

    /**
     * Group by CachedCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CachedCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CachedCategoryGroupByArgs['orderBy'] }
        : { orderBy?: CachedCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CachedCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCachedCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CachedCategory model
   */
  readonly fields: CachedCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CachedCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CachedCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CachedCategory model
   */
  interface CachedCategoryFieldRefs {
    readonly id: FieldRef<"CachedCategory", 'String'>
    readonly name: FieldRef<"CachedCategory", 'String'>
    readonly displayOrder: FieldRef<"CachedCategory", 'Int'>
    readonly imageUrl: FieldRef<"CachedCategory", 'String'>
    readonly kitchenId: FieldRef<"CachedCategory", 'String'>
    readonly createdAt: FieldRef<"CachedCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"CachedCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CachedCategory findUnique
   */
  export type CachedCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
    /**
     * Filter, which CachedCategory to fetch.
     */
    where: CachedCategoryWhereUniqueInput
  }

  /**
   * CachedCategory findUniqueOrThrow
   */
  export type CachedCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
    /**
     * Filter, which CachedCategory to fetch.
     */
    where: CachedCategoryWhereUniqueInput
  }

  /**
   * CachedCategory findFirst
   */
  export type CachedCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
    /**
     * Filter, which CachedCategory to fetch.
     */
    where?: CachedCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedCategories to fetch.
     */
    orderBy?: CachedCategoryOrderByWithRelationInput | CachedCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedCategories.
     */
    cursor?: CachedCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedCategories.
     */
    distinct?: CachedCategoryScalarFieldEnum | CachedCategoryScalarFieldEnum[]
  }

  /**
   * CachedCategory findFirstOrThrow
   */
  export type CachedCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
    /**
     * Filter, which CachedCategory to fetch.
     */
    where?: CachedCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedCategories to fetch.
     */
    orderBy?: CachedCategoryOrderByWithRelationInput | CachedCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedCategories.
     */
    cursor?: CachedCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedCategories.
     */
    distinct?: CachedCategoryScalarFieldEnum | CachedCategoryScalarFieldEnum[]
  }

  /**
   * CachedCategory findMany
   */
  export type CachedCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
    /**
     * Filter, which CachedCategories to fetch.
     */
    where?: CachedCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedCategories to fetch.
     */
    orderBy?: CachedCategoryOrderByWithRelationInput | CachedCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CachedCategories.
     */
    cursor?: CachedCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedCategories.
     */
    distinct?: CachedCategoryScalarFieldEnum | CachedCategoryScalarFieldEnum[]
  }

  /**
   * CachedCategory create
   */
  export type CachedCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
    /**
     * The data needed to create a CachedCategory.
     */
    data: XOR<CachedCategoryCreateInput, CachedCategoryUncheckedCreateInput>
  }

  /**
   * CachedCategory createMany
   */
  export type CachedCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CachedCategories.
     */
    data: CachedCategoryCreateManyInput | CachedCategoryCreateManyInput[]
  }

  /**
   * CachedCategory createManyAndReturn
   */
  export type CachedCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many CachedCategories.
     */
    data: CachedCategoryCreateManyInput | CachedCategoryCreateManyInput[]
  }

  /**
   * CachedCategory update
   */
  export type CachedCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
    /**
     * The data needed to update a CachedCategory.
     */
    data: XOR<CachedCategoryUpdateInput, CachedCategoryUncheckedUpdateInput>
    /**
     * Choose, which CachedCategory to update.
     */
    where: CachedCategoryWhereUniqueInput
  }

  /**
   * CachedCategory updateMany
   */
  export type CachedCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CachedCategories.
     */
    data: XOR<CachedCategoryUpdateManyMutationInput, CachedCategoryUncheckedUpdateManyInput>
    /**
     * Filter which CachedCategories to update
     */
    where?: CachedCategoryWhereInput
    /**
     * Limit how many CachedCategories to update.
     */
    limit?: number
  }

  /**
   * CachedCategory updateManyAndReturn
   */
  export type CachedCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
    /**
     * The data used to update CachedCategories.
     */
    data: XOR<CachedCategoryUpdateManyMutationInput, CachedCategoryUncheckedUpdateManyInput>
    /**
     * Filter which CachedCategories to update
     */
    where?: CachedCategoryWhereInput
    /**
     * Limit how many CachedCategories to update.
     */
    limit?: number
  }

  /**
   * CachedCategory upsert
   */
  export type CachedCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
    /**
     * The filter to search for the CachedCategory to update in case it exists.
     */
    where: CachedCategoryWhereUniqueInput
    /**
     * In case the CachedCategory found by the `where` argument doesn't exist, create a new CachedCategory with this data.
     */
    create: XOR<CachedCategoryCreateInput, CachedCategoryUncheckedCreateInput>
    /**
     * In case the CachedCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CachedCategoryUpdateInput, CachedCategoryUncheckedUpdateInput>
  }

  /**
   * CachedCategory delete
   */
  export type CachedCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
    /**
     * Filter which CachedCategory to delete.
     */
    where: CachedCategoryWhereUniqueInput
  }

  /**
   * CachedCategory deleteMany
   */
  export type CachedCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedCategories to delete
     */
    where?: CachedCategoryWhereInput
    /**
     * Limit how many CachedCategories to delete.
     */
    limit?: number
  }

  /**
   * CachedCategory without action
   */
  export type CachedCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedCategory
     */
    select?: CachedCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedCategory
     */
    omit?: CachedCategoryOmit<ExtArgs> | null
  }


  /**
   * Model CachedArea
   */

  export type AggregateCachedArea = {
    _count: CachedAreaCountAggregateOutputType | null
    _min: CachedAreaMinAggregateOutputType | null
    _max: CachedAreaMaxAggregateOutputType | null
  }

  export type CachedAreaMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
  }

  export type CachedAreaMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
  }

  export type CachedAreaCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    _all: number
  }


  export type CachedAreaMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type CachedAreaMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type CachedAreaCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    _all?: true
  }

  export type CachedAreaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedArea to aggregate.
     */
    where?: CachedAreaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedAreas to fetch.
     */
    orderBy?: CachedAreaOrderByWithRelationInput | CachedAreaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CachedAreaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedAreas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedAreas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CachedAreas
    **/
    _count?: true | CachedAreaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CachedAreaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CachedAreaMaxAggregateInputType
  }

  export type GetCachedAreaAggregateType<T extends CachedAreaAggregateArgs> = {
        [P in keyof T & keyof AggregateCachedArea]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCachedArea[P]>
      : GetScalarType<T[P], AggregateCachedArea[P]>
  }




  export type CachedAreaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CachedAreaWhereInput
    orderBy?: CachedAreaOrderByWithAggregationInput | CachedAreaOrderByWithAggregationInput[]
    by: CachedAreaScalarFieldEnum[] | CachedAreaScalarFieldEnum
    having?: CachedAreaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CachedAreaCountAggregateInputType | true
    _min?: CachedAreaMinAggregateInputType
    _max?: CachedAreaMaxAggregateInputType
  }

  export type CachedAreaGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    _count: CachedAreaCountAggregateOutputType | null
    _min: CachedAreaMinAggregateOutputType | null
    _max: CachedAreaMaxAggregateOutputType | null
  }

  type GetCachedAreaGroupByPayload<T extends CachedAreaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CachedAreaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CachedAreaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CachedAreaGroupByOutputType[P]>
            : GetScalarType<T[P], CachedAreaGroupByOutputType[P]>
        }
      >
    >


  export type CachedAreaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["cachedArea"]>

  export type CachedAreaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["cachedArea"]>

  export type CachedAreaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["cachedArea"]>

  export type CachedAreaSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }

  export type CachedAreaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt", ExtArgs["result"]["cachedArea"]>

  export type $CachedAreaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CachedArea"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
    }, ExtArgs["result"]["cachedArea"]>
    composites: {}
  }

  type CachedAreaGetPayload<S extends boolean | null | undefined | CachedAreaDefaultArgs> = $Result.GetResult<Prisma.$CachedAreaPayload, S>

  type CachedAreaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CachedAreaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CachedAreaCountAggregateInputType | true
    }

  export interface CachedAreaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CachedArea'], meta: { name: 'CachedArea' } }
    /**
     * Find zero or one CachedArea that matches the filter.
     * @param {CachedAreaFindUniqueArgs} args - Arguments to find a CachedArea
     * @example
     * // Get one CachedArea
     * const cachedArea = await prisma.cachedArea.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CachedAreaFindUniqueArgs>(args: SelectSubset<T, CachedAreaFindUniqueArgs<ExtArgs>>): Prisma__CachedAreaClient<$Result.GetResult<Prisma.$CachedAreaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CachedArea that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CachedAreaFindUniqueOrThrowArgs} args - Arguments to find a CachedArea
     * @example
     * // Get one CachedArea
     * const cachedArea = await prisma.cachedArea.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CachedAreaFindUniqueOrThrowArgs>(args: SelectSubset<T, CachedAreaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CachedAreaClient<$Result.GetResult<Prisma.$CachedAreaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedArea that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedAreaFindFirstArgs} args - Arguments to find a CachedArea
     * @example
     * // Get one CachedArea
     * const cachedArea = await prisma.cachedArea.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CachedAreaFindFirstArgs>(args?: SelectSubset<T, CachedAreaFindFirstArgs<ExtArgs>>): Prisma__CachedAreaClient<$Result.GetResult<Prisma.$CachedAreaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedArea that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedAreaFindFirstOrThrowArgs} args - Arguments to find a CachedArea
     * @example
     * // Get one CachedArea
     * const cachedArea = await prisma.cachedArea.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CachedAreaFindFirstOrThrowArgs>(args?: SelectSubset<T, CachedAreaFindFirstOrThrowArgs<ExtArgs>>): Prisma__CachedAreaClient<$Result.GetResult<Prisma.$CachedAreaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CachedAreas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedAreaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CachedAreas
     * const cachedAreas = await prisma.cachedArea.findMany()
     * 
     * // Get first 10 CachedAreas
     * const cachedAreas = await prisma.cachedArea.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cachedAreaWithIdOnly = await prisma.cachedArea.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CachedAreaFindManyArgs>(args?: SelectSubset<T, CachedAreaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedAreaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CachedArea.
     * @param {CachedAreaCreateArgs} args - Arguments to create a CachedArea.
     * @example
     * // Create one CachedArea
     * const CachedArea = await prisma.cachedArea.create({
     *   data: {
     *     // ... data to create a CachedArea
     *   }
     * })
     * 
     */
    create<T extends CachedAreaCreateArgs>(args: SelectSubset<T, CachedAreaCreateArgs<ExtArgs>>): Prisma__CachedAreaClient<$Result.GetResult<Prisma.$CachedAreaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CachedAreas.
     * @param {CachedAreaCreateManyArgs} args - Arguments to create many CachedAreas.
     * @example
     * // Create many CachedAreas
     * const cachedArea = await prisma.cachedArea.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CachedAreaCreateManyArgs>(args?: SelectSubset<T, CachedAreaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CachedAreas and returns the data saved in the database.
     * @param {CachedAreaCreateManyAndReturnArgs} args - Arguments to create many CachedAreas.
     * @example
     * // Create many CachedAreas
     * const cachedArea = await prisma.cachedArea.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CachedAreas and only return the `id`
     * const cachedAreaWithIdOnly = await prisma.cachedArea.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CachedAreaCreateManyAndReturnArgs>(args?: SelectSubset<T, CachedAreaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedAreaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CachedArea.
     * @param {CachedAreaDeleteArgs} args - Arguments to delete one CachedArea.
     * @example
     * // Delete one CachedArea
     * const CachedArea = await prisma.cachedArea.delete({
     *   where: {
     *     // ... filter to delete one CachedArea
     *   }
     * })
     * 
     */
    delete<T extends CachedAreaDeleteArgs>(args: SelectSubset<T, CachedAreaDeleteArgs<ExtArgs>>): Prisma__CachedAreaClient<$Result.GetResult<Prisma.$CachedAreaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CachedArea.
     * @param {CachedAreaUpdateArgs} args - Arguments to update one CachedArea.
     * @example
     * // Update one CachedArea
     * const cachedArea = await prisma.cachedArea.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CachedAreaUpdateArgs>(args: SelectSubset<T, CachedAreaUpdateArgs<ExtArgs>>): Prisma__CachedAreaClient<$Result.GetResult<Prisma.$CachedAreaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CachedAreas.
     * @param {CachedAreaDeleteManyArgs} args - Arguments to filter CachedAreas to delete.
     * @example
     * // Delete a few CachedAreas
     * const { count } = await prisma.cachedArea.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CachedAreaDeleteManyArgs>(args?: SelectSubset<T, CachedAreaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedAreas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedAreaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CachedAreas
     * const cachedArea = await prisma.cachedArea.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CachedAreaUpdateManyArgs>(args: SelectSubset<T, CachedAreaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedAreas and returns the data updated in the database.
     * @param {CachedAreaUpdateManyAndReturnArgs} args - Arguments to update many CachedAreas.
     * @example
     * // Update many CachedAreas
     * const cachedArea = await prisma.cachedArea.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CachedAreas and only return the `id`
     * const cachedAreaWithIdOnly = await prisma.cachedArea.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CachedAreaUpdateManyAndReturnArgs>(args: SelectSubset<T, CachedAreaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedAreaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CachedArea.
     * @param {CachedAreaUpsertArgs} args - Arguments to update or create a CachedArea.
     * @example
     * // Update or create a CachedArea
     * const cachedArea = await prisma.cachedArea.upsert({
     *   create: {
     *     // ... data to create a CachedArea
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CachedArea we want to update
     *   }
     * })
     */
    upsert<T extends CachedAreaUpsertArgs>(args: SelectSubset<T, CachedAreaUpsertArgs<ExtArgs>>): Prisma__CachedAreaClient<$Result.GetResult<Prisma.$CachedAreaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CachedAreas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedAreaCountArgs} args - Arguments to filter CachedAreas to count.
     * @example
     * // Count the number of CachedAreas
     * const count = await prisma.cachedArea.count({
     *   where: {
     *     // ... the filter for the CachedAreas we want to count
     *   }
     * })
    **/
    count<T extends CachedAreaCountArgs>(
      args?: Subset<T, CachedAreaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CachedAreaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CachedArea.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedAreaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CachedAreaAggregateArgs>(args: Subset<T, CachedAreaAggregateArgs>): Prisma.PrismaPromise<GetCachedAreaAggregateType<T>>

    /**
     * Group by CachedArea.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedAreaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CachedAreaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CachedAreaGroupByArgs['orderBy'] }
        : { orderBy?: CachedAreaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CachedAreaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCachedAreaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CachedArea model
   */
  readonly fields: CachedAreaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CachedArea.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CachedAreaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CachedArea model
   */
  interface CachedAreaFieldRefs {
    readonly id: FieldRef<"CachedArea", 'String'>
    readonly name: FieldRef<"CachedArea", 'String'>
    readonly createdAt: FieldRef<"CachedArea", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CachedArea findUnique
   */
  export type CachedAreaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
    /**
     * Filter, which CachedArea to fetch.
     */
    where: CachedAreaWhereUniqueInput
  }

  /**
   * CachedArea findUniqueOrThrow
   */
  export type CachedAreaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
    /**
     * Filter, which CachedArea to fetch.
     */
    where: CachedAreaWhereUniqueInput
  }

  /**
   * CachedArea findFirst
   */
  export type CachedAreaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
    /**
     * Filter, which CachedArea to fetch.
     */
    where?: CachedAreaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedAreas to fetch.
     */
    orderBy?: CachedAreaOrderByWithRelationInput | CachedAreaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedAreas.
     */
    cursor?: CachedAreaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedAreas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedAreas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedAreas.
     */
    distinct?: CachedAreaScalarFieldEnum | CachedAreaScalarFieldEnum[]
  }

  /**
   * CachedArea findFirstOrThrow
   */
  export type CachedAreaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
    /**
     * Filter, which CachedArea to fetch.
     */
    where?: CachedAreaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedAreas to fetch.
     */
    orderBy?: CachedAreaOrderByWithRelationInput | CachedAreaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedAreas.
     */
    cursor?: CachedAreaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedAreas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedAreas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedAreas.
     */
    distinct?: CachedAreaScalarFieldEnum | CachedAreaScalarFieldEnum[]
  }

  /**
   * CachedArea findMany
   */
  export type CachedAreaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
    /**
     * Filter, which CachedAreas to fetch.
     */
    where?: CachedAreaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedAreas to fetch.
     */
    orderBy?: CachedAreaOrderByWithRelationInput | CachedAreaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CachedAreas.
     */
    cursor?: CachedAreaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedAreas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedAreas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedAreas.
     */
    distinct?: CachedAreaScalarFieldEnum | CachedAreaScalarFieldEnum[]
  }

  /**
   * CachedArea create
   */
  export type CachedAreaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
    /**
     * The data needed to create a CachedArea.
     */
    data: XOR<CachedAreaCreateInput, CachedAreaUncheckedCreateInput>
  }

  /**
   * CachedArea createMany
   */
  export type CachedAreaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CachedAreas.
     */
    data: CachedAreaCreateManyInput | CachedAreaCreateManyInput[]
  }

  /**
   * CachedArea createManyAndReturn
   */
  export type CachedAreaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
    /**
     * The data used to create many CachedAreas.
     */
    data: CachedAreaCreateManyInput | CachedAreaCreateManyInput[]
  }

  /**
   * CachedArea update
   */
  export type CachedAreaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
    /**
     * The data needed to update a CachedArea.
     */
    data: XOR<CachedAreaUpdateInput, CachedAreaUncheckedUpdateInput>
    /**
     * Choose, which CachedArea to update.
     */
    where: CachedAreaWhereUniqueInput
  }

  /**
   * CachedArea updateMany
   */
  export type CachedAreaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CachedAreas.
     */
    data: XOR<CachedAreaUpdateManyMutationInput, CachedAreaUncheckedUpdateManyInput>
    /**
     * Filter which CachedAreas to update
     */
    where?: CachedAreaWhereInput
    /**
     * Limit how many CachedAreas to update.
     */
    limit?: number
  }

  /**
   * CachedArea updateManyAndReturn
   */
  export type CachedAreaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
    /**
     * The data used to update CachedAreas.
     */
    data: XOR<CachedAreaUpdateManyMutationInput, CachedAreaUncheckedUpdateManyInput>
    /**
     * Filter which CachedAreas to update
     */
    where?: CachedAreaWhereInput
    /**
     * Limit how many CachedAreas to update.
     */
    limit?: number
  }

  /**
   * CachedArea upsert
   */
  export type CachedAreaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
    /**
     * The filter to search for the CachedArea to update in case it exists.
     */
    where: CachedAreaWhereUniqueInput
    /**
     * In case the CachedArea found by the `where` argument doesn't exist, create a new CachedArea with this data.
     */
    create: XOR<CachedAreaCreateInput, CachedAreaUncheckedCreateInput>
    /**
     * In case the CachedArea was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CachedAreaUpdateInput, CachedAreaUncheckedUpdateInput>
  }

  /**
   * CachedArea delete
   */
  export type CachedAreaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
    /**
     * Filter which CachedArea to delete.
     */
    where: CachedAreaWhereUniqueInput
  }

  /**
   * CachedArea deleteMany
   */
  export type CachedAreaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedAreas to delete
     */
    where?: CachedAreaWhereInput
    /**
     * Limit how many CachedAreas to delete.
     */
    limit?: number
  }

  /**
   * CachedArea without action
   */
  export type CachedAreaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedArea
     */
    select?: CachedAreaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedArea
     */
    omit?: CachedAreaOmit<ExtArgs> | null
  }


  /**
   * Model CachedItem
   */

  export type AggregateCachedItem = {
    _count: CachedItemCountAggregateOutputType | null
    _avg: CachedItemAvgAggregateOutputType | null
    _sum: CachedItemSumAggregateOutputType | null
    _min: CachedItemMinAggregateOutputType | null
    _max: CachedItemMaxAggregateOutputType | null
  }

  export type CachedItemAvgAggregateOutputType = {
    basePrice: number | null
  }

  export type CachedItemSumAggregateOutputType = {
    basePrice: number | null
  }

  export type CachedItemMinAggregateOutputType = {
    id: string | null
    name: string | null
    basePrice: number | null
    inStock: boolean | null
    categoryId: string | null
    categoryName: string | null
    variations: string | null
    imageUrl: string | null
  }

  export type CachedItemMaxAggregateOutputType = {
    id: string | null
    name: string | null
    basePrice: number | null
    inStock: boolean | null
    categoryId: string | null
    categoryName: string | null
    variations: string | null
    imageUrl: string | null
  }

  export type CachedItemCountAggregateOutputType = {
    id: number
    name: number
    basePrice: number
    inStock: number
    categoryId: number
    categoryName: number
    variations: number
    imageUrl: number
    _all: number
  }


  export type CachedItemAvgAggregateInputType = {
    basePrice?: true
  }

  export type CachedItemSumAggregateInputType = {
    basePrice?: true
  }

  export type CachedItemMinAggregateInputType = {
    id?: true
    name?: true
    basePrice?: true
    inStock?: true
    categoryId?: true
    categoryName?: true
    variations?: true
    imageUrl?: true
  }

  export type CachedItemMaxAggregateInputType = {
    id?: true
    name?: true
    basePrice?: true
    inStock?: true
    categoryId?: true
    categoryName?: true
    variations?: true
    imageUrl?: true
  }

  export type CachedItemCountAggregateInputType = {
    id?: true
    name?: true
    basePrice?: true
    inStock?: true
    categoryId?: true
    categoryName?: true
    variations?: true
    imageUrl?: true
    _all?: true
  }

  export type CachedItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedItem to aggregate.
     */
    where?: CachedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedItems to fetch.
     */
    orderBy?: CachedItemOrderByWithRelationInput | CachedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CachedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CachedItems
    **/
    _count?: true | CachedItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CachedItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CachedItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CachedItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CachedItemMaxAggregateInputType
  }

  export type GetCachedItemAggregateType<T extends CachedItemAggregateArgs> = {
        [P in keyof T & keyof AggregateCachedItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCachedItem[P]>
      : GetScalarType<T[P], AggregateCachedItem[P]>
  }




  export type CachedItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CachedItemWhereInput
    orderBy?: CachedItemOrderByWithAggregationInput | CachedItemOrderByWithAggregationInput[]
    by: CachedItemScalarFieldEnum[] | CachedItemScalarFieldEnum
    having?: CachedItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CachedItemCountAggregateInputType | true
    _avg?: CachedItemAvgAggregateInputType
    _sum?: CachedItemSumAggregateInputType
    _min?: CachedItemMinAggregateInputType
    _max?: CachedItemMaxAggregateInputType
  }

  export type CachedItemGroupByOutputType = {
    id: string
    name: string
    basePrice: number
    inStock: boolean
    categoryId: string | null
    categoryName: string | null
    variations: string
    imageUrl: string | null
    _count: CachedItemCountAggregateOutputType | null
    _avg: CachedItemAvgAggregateOutputType | null
    _sum: CachedItemSumAggregateOutputType | null
    _min: CachedItemMinAggregateOutputType | null
    _max: CachedItemMaxAggregateOutputType | null
  }

  type GetCachedItemGroupByPayload<T extends CachedItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CachedItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CachedItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CachedItemGroupByOutputType[P]>
            : GetScalarType<T[P], CachedItemGroupByOutputType[P]>
        }
      >
    >


  export type CachedItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    basePrice?: boolean
    inStock?: boolean
    categoryId?: boolean
    categoryName?: boolean
    variations?: boolean
    imageUrl?: boolean
  }, ExtArgs["result"]["cachedItem"]>

  export type CachedItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    basePrice?: boolean
    inStock?: boolean
    categoryId?: boolean
    categoryName?: boolean
    variations?: boolean
    imageUrl?: boolean
  }, ExtArgs["result"]["cachedItem"]>

  export type CachedItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    basePrice?: boolean
    inStock?: boolean
    categoryId?: boolean
    categoryName?: boolean
    variations?: boolean
    imageUrl?: boolean
  }, ExtArgs["result"]["cachedItem"]>

  export type CachedItemSelectScalar = {
    id?: boolean
    name?: boolean
    basePrice?: boolean
    inStock?: boolean
    categoryId?: boolean
    categoryName?: boolean
    variations?: boolean
    imageUrl?: boolean
  }

  export type CachedItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "basePrice" | "inStock" | "categoryId" | "categoryName" | "variations" | "imageUrl", ExtArgs["result"]["cachedItem"]>

  export type $CachedItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CachedItem"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      basePrice: number
      inStock: boolean
      categoryId: string | null
      categoryName: string | null
      variations: string
      imageUrl: string | null
    }, ExtArgs["result"]["cachedItem"]>
    composites: {}
  }

  type CachedItemGetPayload<S extends boolean | null | undefined | CachedItemDefaultArgs> = $Result.GetResult<Prisma.$CachedItemPayload, S>

  type CachedItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CachedItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CachedItemCountAggregateInputType | true
    }

  export interface CachedItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CachedItem'], meta: { name: 'CachedItem' } }
    /**
     * Find zero or one CachedItem that matches the filter.
     * @param {CachedItemFindUniqueArgs} args - Arguments to find a CachedItem
     * @example
     * // Get one CachedItem
     * const cachedItem = await prisma.cachedItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CachedItemFindUniqueArgs>(args: SelectSubset<T, CachedItemFindUniqueArgs<ExtArgs>>): Prisma__CachedItemClient<$Result.GetResult<Prisma.$CachedItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CachedItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CachedItemFindUniqueOrThrowArgs} args - Arguments to find a CachedItem
     * @example
     * // Get one CachedItem
     * const cachedItem = await prisma.cachedItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CachedItemFindUniqueOrThrowArgs>(args: SelectSubset<T, CachedItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CachedItemClient<$Result.GetResult<Prisma.$CachedItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedItemFindFirstArgs} args - Arguments to find a CachedItem
     * @example
     * // Get one CachedItem
     * const cachedItem = await prisma.cachedItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CachedItemFindFirstArgs>(args?: SelectSubset<T, CachedItemFindFirstArgs<ExtArgs>>): Prisma__CachedItemClient<$Result.GetResult<Prisma.$CachedItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedItemFindFirstOrThrowArgs} args - Arguments to find a CachedItem
     * @example
     * // Get one CachedItem
     * const cachedItem = await prisma.cachedItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CachedItemFindFirstOrThrowArgs>(args?: SelectSubset<T, CachedItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__CachedItemClient<$Result.GetResult<Prisma.$CachedItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CachedItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CachedItems
     * const cachedItems = await prisma.cachedItem.findMany()
     * 
     * // Get first 10 CachedItems
     * const cachedItems = await prisma.cachedItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cachedItemWithIdOnly = await prisma.cachedItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CachedItemFindManyArgs>(args?: SelectSubset<T, CachedItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CachedItem.
     * @param {CachedItemCreateArgs} args - Arguments to create a CachedItem.
     * @example
     * // Create one CachedItem
     * const CachedItem = await prisma.cachedItem.create({
     *   data: {
     *     // ... data to create a CachedItem
     *   }
     * })
     * 
     */
    create<T extends CachedItemCreateArgs>(args: SelectSubset<T, CachedItemCreateArgs<ExtArgs>>): Prisma__CachedItemClient<$Result.GetResult<Prisma.$CachedItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CachedItems.
     * @param {CachedItemCreateManyArgs} args - Arguments to create many CachedItems.
     * @example
     * // Create many CachedItems
     * const cachedItem = await prisma.cachedItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CachedItemCreateManyArgs>(args?: SelectSubset<T, CachedItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CachedItems and returns the data saved in the database.
     * @param {CachedItemCreateManyAndReturnArgs} args - Arguments to create many CachedItems.
     * @example
     * // Create many CachedItems
     * const cachedItem = await prisma.cachedItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CachedItems and only return the `id`
     * const cachedItemWithIdOnly = await prisma.cachedItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CachedItemCreateManyAndReturnArgs>(args?: SelectSubset<T, CachedItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CachedItem.
     * @param {CachedItemDeleteArgs} args - Arguments to delete one CachedItem.
     * @example
     * // Delete one CachedItem
     * const CachedItem = await prisma.cachedItem.delete({
     *   where: {
     *     // ... filter to delete one CachedItem
     *   }
     * })
     * 
     */
    delete<T extends CachedItemDeleteArgs>(args: SelectSubset<T, CachedItemDeleteArgs<ExtArgs>>): Prisma__CachedItemClient<$Result.GetResult<Prisma.$CachedItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CachedItem.
     * @param {CachedItemUpdateArgs} args - Arguments to update one CachedItem.
     * @example
     * // Update one CachedItem
     * const cachedItem = await prisma.cachedItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CachedItemUpdateArgs>(args: SelectSubset<T, CachedItemUpdateArgs<ExtArgs>>): Prisma__CachedItemClient<$Result.GetResult<Prisma.$CachedItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CachedItems.
     * @param {CachedItemDeleteManyArgs} args - Arguments to filter CachedItems to delete.
     * @example
     * // Delete a few CachedItems
     * const { count } = await prisma.cachedItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CachedItemDeleteManyArgs>(args?: SelectSubset<T, CachedItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CachedItems
     * const cachedItem = await prisma.cachedItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CachedItemUpdateManyArgs>(args: SelectSubset<T, CachedItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedItems and returns the data updated in the database.
     * @param {CachedItemUpdateManyAndReturnArgs} args - Arguments to update many CachedItems.
     * @example
     * // Update many CachedItems
     * const cachedItem = await prisma.cachedItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CachedItems and only return the `id`
     * const cachedItemWithIdOnly = await prisma.cachedItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CachedItemUpdateManyAndReturnArgs>(args: SelectSubset<T, CachedItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CachedItem.
     * @param {CachedItemUpsertArgs} args - Arguments to update or create a CachedItem.
     * @example
     * // Update or create a CachedItem
     * const cachedItem = await prisma.cachedItem.upsert({
     *   create: {
     *     // ... data to create a CachedItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CachedItem we want to update
     *   }
     * })
     */
    upsert<T extends CachedItemUpsertArgs>(args: SelectSubset<T, CachedItemUpsertArgs<ExtArgs>>): Prisma__CachedItemClient<$Result.GetResult<Prisma.$CachedItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CachedItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedItemCountArgs} args - Arguments to filter CachedItems to count.
     * @example
     * // Count the number of CachedItems
     * const count = await prisma.cachedItem.count({
     *   where: {
     *     // ... the filter for the CachedItems we want to count
     *   }
     * })
    **/
    count<T extends CachedItemCountArgs>(
      args?: Subset<T, CachedItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CachedItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CachedItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CachedItemAggregateArgs>(args: Subset<T, CachedItemAggregateArgs>): Prisma.PrismaPromise<GetCachedItemAggregateType<T>>

    /**
     * Group by CachedItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CachedItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CachedItemGroupByArgs['orderBy'] }
        : { orderBy?: CachedItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CachedItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCachedItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CachedItem model
   */
  readonly fields: CachedItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CachedItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CachedItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CachedItem model
   */
  interface CachedItemFieldRefs {
    readonly id: FieldRef<"CachedItem", 'String'>
    readonly name: FieldRef<"CachedItem", 'String'>
    readonly basePrice: FieldRef<"CachedItem", 'Float'>
    readonly inStock: FieldRef<"CachedItem", 'Boolean'>
    readonly categoryId: FieldRef<"CachedItem", 'String'>
    readonly categoryName: FieldRef<"CachedItem", 'String'>
    readonly variations: FieldRef<"CachedItem", 'String'>
    readonly imageUrl: FieldRef<"CachedItem", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CachedItem findUnique
   */
  export type CachedItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
    /**
     * Filter, which CachedItem to fetch.
     */
    where: CachedItemWhereUniqueInput
  }

  /**
   * CachedItem findUniqueOrThrow
   */
  export type CachedItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
    /**
     * Filter, which CachedItem to fetch.
     */
    where: CachedItemWhereUniqueInput
  }

  /**
   * CachedItem findFirst
   */
  export type CachedItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
    /**
     * Filter, which CachedItem to fetch.
     */
    where?: CachedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedItems to fetch.
     */
    orderBy?: CachedItemOrderByWithRelationInput | CachedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedItems.
     */
    cursor?: CachedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedItems.
     */
    distinct?: CachedItemScalarFieldEnum | CachedItemScalarFieldEnum[]
  }

  /**
   * CachedItem findFirstOrThrow
   */
  export type CachedItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
    /**
     * Filter, which CachedItem to fetch.
     */
    where?: CachedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedItems to fetch.
     */
    orderBy?: CachedItemOrderByWithRelationInput | CachedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedItems.
     */
    cursor?: CachedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedItems.
     */
    distinct?: CachedItemScalarFieldEnum | CachedItemScalarFieldEnum[]
  }

  /**
   * CachedItem findMany
   */
  export type CachedItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
    /**
     * Filter, which CachedItems to fetch.
     */
    where?: CachedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedItems to fetch.
     */
    orderBy?: CachedItemOrderByWithRelationInput | CachedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CachedItems.
     */
    cursor?: CachedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedItems.
     */
    distinct?: CachedItemScalarFieldEnum | CachedItemScalarFieldEnum[]
  }

  /**
   * CachedItem create
   */
  export type CachedItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
    /**
     * The data needed to create a CachedItem.
     */
    data: XOR<CachedItemCreateInput, CachedItemUncheckedCreateInput>
  }

  /**
   * CachedItem createMany
   */
  export type CachedItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CachedItems.
     */
    data: CachedItemCreateManyInput | CachedItemCreateManyInput[]
  }

  /**
   * CachedItem createManyAndReturn
   */
  export type CachedItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
    /**
     * The data used to create many CachedItems.
     */
    data: CachedItemCreateManyInput | CachedItemCreateManyInput[]
  }

  /**
   * CachedItem update
   */
  export type CachedItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
    /**
     * The data needed to update a CachedItem.
     */
    data: XOR<CachedItemUpdateInput, CachedItemUncheckedUpdateInput>
    /**
     * Choose, which CachedItem to update.
     */
    where: CachedItemWhereUniqueInput
  }

  /**
   * CachedItem updateMany
   */
  export type CachedItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CachedItems.
     */
    data: XOR<CachedItemUpdateManyMutationInput, CachedItemUncheckedUpdateManyInput>
    /**
     * Filter which CachedItems to update
     */
    where?: CachedItemWhereInput
    /**
     * Limit how many CachedItems to update.
     */
    limit?: number
  }

  /**
   * CachedItem updateManyAndReturn
   */
  export type CachedItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
    /**
     * The data used to update CachedItems.
     */
    data: XOR<CachedItemUpdateManyMutationInput, CachedItemUncheckedUpdateManyInput>
    /**
     * Filter which CachedItems to update
     */
    where?: CachedItemWhereInput
    /**
     * Limit how many CachedItems to update.
     */
    limit?: number
  }

  /**
   * CachedItem upsert
   */
  export type CachedItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
    /**
     * The filter to search for the CachedItem to update in case it exists.
     */
    where: CachedItemWhereUniqueInput
    /**
     * In case the CachedItem found by the `where` argument doesn't exist, create a new CachedItem with this data.
     */
    create: XOR<CachedItemCreateInput, CachedItemUncheckedCreateInput>
    /**
     * In case the CachedItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CachedItemUpdateInput, CachedItemUncheckedUpdateInput>
  }

  /**
   * CachedItem delete
   */
  export type CachedItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
    /**
     * Filter which CachedItem to delete.
     */
    where: CachedItemWhereUniqueInput
  }

  /**
   * CachedItem deleteMany
   */
  export type CachedItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedItems to delete
     */
    where?: CachedItemWhereInput
    /**
     * Limit how many CachedItems to delete.
     */
    limit?: number
  }

  /**
   * CachedItem without action
   */
  export type CachedItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedItem
     */
    select?: CachedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedItem
     */
    omit?: CachedItemOmit<ExtArgs> | null
  }


  /**
   * Model CachedSetting
   */

  export type AggregateCachedSetting = {
    _count: CachedSettingCountAggregateOutputType | null
    _min: CachedSettingMinAggregateOutputType | null
    _max: CachedSettingMaxAggregateOutputType | null
  }

  export type CachedSettingMinAggregateOutputType = {
    id: string | null
    data: string | null
  }

  export type CachedSettingMaxAggregateOutputType = {
    id: string | null
    data: string | null
  }

  export type CachedSettingCountAggregateOutputType = {
    id: number
    data: number
    _all: number
  }


  export type CachedSettingMinAggregateInputType = {
    id?: true
    data?: true
  }

  export type CachedSettingMaxAggregateInputType = {
    id?: true
    data?: true
  }

  export type CachedSettingCountAggregateInputType = {
    id?: true
    data?: true
    _all?: true
  }

  export type CachedSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedSetting to aggregate.
     */
    where?: CachedSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedSettings to fetch.
     */
    orderBy?: CachedSettingOrderByWithRelationInput | CachedSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CachedSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CachedSettings
    **/
    _count?: true | CachedSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CachedSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CachedSettingMaxAggregateInputType
  }

  export type GetCachedSettingAggregateType<T extends CachedSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateCachedSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCachedSetting[P]>
      : GetScalarType<T[P], AggregateCachedSetting[P]>
  }




  export type CachedSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CachedSettingWhereInput
    orderBy?: CachedSettingOrderByWithAggregationInput | CachedSettingOrderByWithAggregationInput[]
    by: CachedSettingScalarFieldEnum[] | CachedSettingScalarFieldEnum
    having?: CachedSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CachedSettingCountAggregateInputType | true
    _min?: CachedSettingMinAggregateInputType
    _max?: CachedSettingMaxAggregateInputType
  }

  export type CachedSettingGroupByOutputType = {
    id: string
    data: string
    _count: CachedSettingCountAggregateOutputType | null
    _min: CachedSettingMinAggregateOutputType | null
    _max: CachedSettingMaxAggregateOutputType | null
  }

  type GetCachedSettingGroupByPayload<T extends CachedSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CachedSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CachedSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CachedSettingGroupByOutputType[P]>
            : GetScalarType<T[P], CachedSettingGroupByOutputType[P]>
        }
      >
    >


  export type CachedSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    data?: boolean
  }, ExtArgs["result"]["cachedSetting"]>

  export type CachedSettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    data?: boolean
  }, ExtArgs["result"]["cachedSetting"]>

  export type CachedSettingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    data?: boolean
  }, ExtArgs["result"]["cachedSetting"]>

  export type CachedSettingSelectScalar = {
    id?: boolean
    data?: boolean
  }

  export type CachedSettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "data", ExtArgs["result"]["cachedSetting"]>

  export type $CachedSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CachedSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      data: string
    }, ExtArgs["result"]["cachedSetting"]>
    composites: {}
  }

  type CachedSettingGetPayload<S extends boolean | null | undefined | CachedSettingDefaultArgs> = $Result.GetResult<Prisma.$CachedSettingPayload, S>

  type CachedSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CachedSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CachedSettingCountAggregateInputType | true
    }

  export interface CachedSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CachedSetting'], meta: { name: 'CachedSetting' } }
    /**
     * Find zero or one CachedSetting that matches the filter.
     * @param {CachedSettingFindUniqueArgs} args - Arguments to find a CachedSetting
     * @example
     * // Get one CachedSetting
     * const cachedSetting = await prisma.cachedSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CachedSettingFindUniqueArgs>(args: SelectSubset<T, CachedSettingFindUniqueArgs<ExtArgs>>): Prisma__CachedSettingClient<$Result.GetResult<Prisma.$CachedSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CachedSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CachedSettingFindUniqueOrThrowArgs} args - Arguments to find a CachedSetting
     * @example
     * // Get one CachedSetting
     * const cachedSetting = await prisma.cachedSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CachedSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, CachedSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CachedSettingClient<$Result.GetResult<Prisma.$CachedSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedSettingFindFirstArgs} args - Arguments to find a CachedSetting
     * @example
     * // Get one CachedSetting
     * const cachedSetting = await prisma.cachedSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CachedSettingFindFirstArgs>(args?: SelectSubset<T, CachedSettingFindFirstArgs<ExtArgs>>): Prisma__CachedSettingClient<$Result.GetResult<Prisma.$CachedSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedSettingFindFirstOrThrowArgs} args - Arguments to find a CachedSetting
     * @example
     * // Get one CachedSetting
     * const cachedSetting = await prisma.cachedSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CachedSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, CachedSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__CachedSettingClient<$Result.GetResult<Prisma.$CachedSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CachedSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CachedSettings
     * const cachedSettings = await prisma.cachedSetting.findMany()
     * 
     * // Get first 10 CachedSettings
     * const cachedSettings = await prisma.cachedSetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cachedSettingWithIdOnly = await prisma.cachedSetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CachedSettingFindManyArgs>(args?: SelectSubset<T, CachedSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CachedSetting.
     * @param {CachedSettingCreateArgs} args - Arguments to create a CachedSetting.
     * @example
     * // Create one CachedSetting
     * const CachedSetting = await prisma.cachedSetting.create({
     *   data: {
     *     // ... data to create a CachedSetting
     *   }
     * })
     * 
     */
    create<T extends CachedSettingCreateArgs>(args: SelectSubset<T, CachedSettingCreateArgs<ExtArgs>>): Prisma__CachedSettingClient<$Result.GetResult<Prisma.$CachedSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CachedSettings.
     * @param {CachedSettingCreateManyArgs} args - Arguments to create many CachedSettings.
     * @example
     * // Create many CachedSettings
     * const cachedSetting = await prisma.cachedSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CachedSettingCreateManyArgs>(args?: SelectSubset<T, CachedSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CachedSettings and returns the data saved in the database.
     * @param {CachedSettingCreateManyAndReturnArgs} args - Arguments to create many CachedSettings.
     * @example
     * // Create many CachedSettings
     * const cachedSetting = await prisma.cachedSetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CachedSettings and only return the `id`
     * const cachedSettingWithIdOnly = await prisma.cachedSetting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CachedSettingCreateManyAndReturnArgs>(args?: SelectSubset<T, CachedSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedSettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CachedSetting.
     * @param {CachedSettingDeleteArgs} args - Arguments to delete one CachedSetting.
     * @example
     * // Delete one CachedSetting
     * const CachedSetting = await prisma.cachedSetting.delete({
     *   where: {
     *     // ... filter to delete one CachedSetting
     *   }
     * })
     * 
     */
    delete<T extends CachedSettingDeleteArgs>(args: SelectSubset<T, CachedSettingDeleteArgs<ExtArgs>>): Prisma__CachedSettingClient<$Result.GetResult<Prisma.$CachedSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CachedSetting.
     * @param {CachedSettingUpdateArgs} args - Arguments to update one CachedSetting.
     * @example
     * // Update one CachedSetting
     * const cachedSetting = await prisma.cachedSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CachedSettingUpdateArgs>(args: SelectSubset<T, CachedSettingUpdateArgs<ExtArgs>>): Prisma__CachedSettingClient<$Result.GetResult<Prisma.$CachedSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CachedSettings.
     * @param {CachedSettingDeleteManyArgs} args - Arguments to filter CachedSettings to delete.
     * @example
     * // Delete a few CachedSettings
     * const { count } = await prisma.cachedSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CachedSettingDeleteManyArgs>(args?: SelectSubset<T, CachedSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CachedSettings
     * const cachedSetting = await prisma.cachedSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CachedSettingUpdateManyArgs>(args: SelectSubset<T, CachedSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedSettings and returns the data updated in the database.
     * @param {CachedSettingUpdateManyAndReturnArgs} args - Arguments to update many CachedSettings.
     * @example
     * // Update many CachedSettings
     * const cachedSetting = await prisma.cachedSetting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CachedSettings and only return the `id`
     * const cachedSettingWithIdOnly = await prisma.cachedSetting.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CachedSettingUpdateManyAndReturnArgs>(args: SelectSubset<T, CachedSettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedSettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CachedSetting.
     * @param {CachedSettingUpsertArgs} args - Arguments to update or create a CachedSetting.
     * @example
     * // Update or create a CachedSetting
     * const cachedSetting = await prisma.cachedSetting.upsert({
     *   create: {
     *     // ... data to create a CachedSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CachedSetting we want to update
     *   }
     * })
     */
    upsert<T extends CachedSettingUpsertArgs>(args: SelectSubset<T, CachedSettingUpsertArgs<ExtArgs>>): Prisma__CachedSettingClient<$Result.GetResult<Prisma.$CachedSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CachedSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedSettingCountArgs} args - Arguments to filter CachedSettings to count.
     * @example
     * // Count the number of CachedSettings
     * const count = await prisma.cachedSetting.count({
     *   where: {
     *     // ... the filter for the CachedSettings we want to count
     *   }
     * })
    **/
    count<T extends CachedSettingCountArgs>(
      args?: Subset<T, CachedSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CachedSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CachedSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CachedSettingAggregateArgs>(args: Subset<T, CachedSettingAggregateArgs>): Prisma.PrismaPromise<GetCachedSettingAggregateType<T>>

    /**
     * Group by CachedSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CachedSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CachedSettingGroupByArgs['orderBy'] }
        : { orderBy?: CachedSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CachedSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCachedSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CachedSetting model
   */
  readonly fields: CachedSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CachedSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CachedSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CachedSetting model
   */
  interface CachedSettingFieldRefs {
    readonly id: FieldRef<"CachedSetting", 'String'>
    readonly data: FieldRef<"CachedSetting", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CachedSetting findUnique
   */
  export type CachedSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
    /**
     * Filter, which CachedSetting to fetch.
     */
    where: CachedSettingWhereUniqueInput
  }

  /**
   * CachedSetting findUniqueOrThrow
   */
  export type CachedSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
    /**
     * Filter, which CachedSetting to fetch.
     */
    where: CachedSettingWhereUniqueInput
  }

  /**
   * CachedSetting findFirst
   */
  export type CachedSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
    /**
     * Filter, which CachedSetting to fetch.
     */
    where?: CachedSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedSettings to fetch.
     */
    orderBy?: CachedSettingOrderByWithRelationInput | CachedSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedSettings.
     */
    cursor?: CachedSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedSettings.
     */
    distinct?: CachedSettingScalarFieldEnum | CachedSettingScalarFieldEnum[]
  }

  /**
   * CachedSetting findFirstOrThrow
   */
  export type CachedSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
    /**
     * Filter, which CachedSetting to fetch.
     */
    where?: CachedSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedSettings to fetch.
     */
    orderBy?: CachedSettingOrderByWithRelationInput | CachedSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedSettings.
     */
    cursor?: CachedSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedSettings.
     */
    distinct?: CachedSettingScalarFieldEnum | CachedSettingScalarFieldEnum[]
  }

  /**
   * CachedSetting findMany
   */
  export type CachedSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
    /**
     * Filter, which CachedSettings to fetch.
     */
    where?: CachedSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedSettings to fetch.
     */
    orderBy?: CachedSettingOrderByWithRelationInput | CachedSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CachedSettings.
     */
    cursor?: CachedSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedSettings.
     */
    distinct?: CachedSettingScalarFieldEnum | CachedSettingScalarFieldEnum[]
  }

  /**
   * CachedSetting create
   */
  export type CachedSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
    /**
     * The data needed to create a CachedSetting.
     */
    data: XOR<CachedSettingCreateInput, CachedSettingUncheckedCreateInput>
  }

  /**
   * CachedSetting createMany
   */
  export type CachedSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CachedSettings.
     */
    data: CachedSettingCreateManyInput | CachedSettingCreateManyInput[]
  }

  /**
   * CachedSetting createManyAndReturn
   */
  export type CachedSettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
    /**
     * The data used to create many CachedSettings.
     */
    data: CachedSettingCreateManyInput | CachedSettingCreateManyInput[]
  }

  /**
   * CachedSetting update
   */
  export type CachedSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
    /**
     * The data needed to update a CachedSetting.
     */
    data: XOR<CachedSettingUpdateInput, CachedSettingUncheckedUpdateInput>
    /**
     * Choose, which CachedSetting to update.
     */
    where: CachedSettingWhereUniqueInput
  }

  /**
   * CachedSetting updateMany
   */
  export type CachedSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CachedSettings.
     */
    data: XOR<CachedSettingUpdateManyMutationInput, CachedSettingUncheckedUpdateManyInput>
    /**
     * Filter which CachedSettings to update
     */
    where?: CachedSettingWhereInput
    /**
     * Limit how many CachedSettings to update.
     */
    limit?: number
  }

  /**
   * CachedSetting updateManyAndReturn
   */
  export type CachedSettingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
    /**
     * The data used to update CachedSettings.
     */
    data: XOR<CachedSettingUpdateManyMutationInput, CachedSettingUncheckedUpdateManyInput>
    /**
     * Filter which CachedSettings to update
     */
    where?: CachedSettingWhereInput
    /**
     * Limit how many CachedSettings to update.
     */
    limit?: number
  }

  /**
   * CachedSetting upsert
   */
  export type CachedSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
    /**
     * The filter to search for the CachedSetting to update in case it exists.
     */
    where: CachedSettingWhereUniqueInput
    /**
     * In case the CachedSetting found by the `where` argument doesn't exist, create a new CachedSetting with this data.
     */
    create: XOR<CachedSettingCreateInput, CachedSettingUncheckedCreateInput>
    /**
     * In case the CachedSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CachedSettingUpdateInput, CachedSettingUncheckedUpdateInput>
  }

  /**
   * CachedSetting delete
   */
  export type CachedSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
    /**
     * Filter which CachedSetting to delete.
     */
    where: CachedSettingWhereUniqueInput
  }

  /**
   * CachedSetting deleteMany
   */
  export type CachedSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedSettings to delete
     */
    where?: CachedSettingWhereInput
    /**
     * Limit how many CachedSettings to delete.
     */
    limit?: number
  }

  /**
   * CachedSetting without action
   */
  export type CachedSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedSetting
     */
    select?: CachedSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedSetting
     */
    omit?: CachedSettingOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LocalOrderScalarFieldEnum: {
    id: 'id',
    tableId: 'tableId',
    tableName: 'tableName',
    customerId: 'customerId',
    customerPhone: 'customerPhone',
    guestCount: 'guestCount',
    status: 'status',
    syncStatus: 'syncStatus',
    subtotal: 'subtotal',
    taxTotal: 'taxTotal',
    discountTotal: 'discountTotal',
    grandTotal: 'grandTotal',
    orderType: 'orderType',
    note: 'note',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LocalOrderScalarFieldEnum = (typeof LocalOrderScalarFieldEnum)[keyof typeof LocalOrderScalarFieldEnum]


  export const LocalOrderItemScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    itemId: 'itemId',
    itemName: 'itemName',
    variationId: 'variationId',
    variationName: 'variationName',
    kotId: 'kotId',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    lineTotal: 'lineTotal',
    status: 'status',
    note: 'note'
  };

  export type LocalOrderItemScalarFieldEnum = (typeof LocalOrderItemScalarFieldEnum)[keyof typeof LocalOrderItemScalarFieldEnum]


  export const LocalKOTScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    kotNumber: 'kotNumber',
    sentAt: 'sentAt',
    sentBy: 'sentBy'
  };

  export type LocalKOTScalarFieldEnum = (typeof LocalKOTScalarFieldEnum)[keyof typeof LocalKOTScalarFieldEnum]


  export const LocalSettlementScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    subtotal: 'subtotal',
    taxTotal: 'taxTotal',
    discountTotal: 'discountTotal',
    grandTotal: 'grandTotal',
    cashPaid: 'cashPaid',
    cardPaid: 'cardPaid',
    upiPaid: 'upiPaid',
    discountType: 'discountType',
    discountValue: 'discountValue',
    discountReason: 'discountReason',
    changeGiven: 'changeGiven',
    settledAt: 'settledAt'
  };

  export type LocalSettlementScalarFieldEnum = (typeof LocalSettlementScalarFieldEnum)[keyof typeof LocalSettlementScalarFieldEnum]


  export const SyncQueueScalarFieldEnum: {
    id: 'id',
    action: 'action',
    payload: 'payload',
    status: 'status',
    retryCount: 'retryCount',
    retryAt: 'retryAt',
    error: 'error',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SyncQueueScalarFieldEnum = (typeof SyncQueueScalarFieldEnum)[keyof typeof SyncQueueScalarFieldEnum]


  export const SyncStateScalarFieldEnum: {
    id: 'id',
    lastSyncAt: 'lastSyncAt',
    pendingCount: 'pendingCount',
    syncInProgress: 'syncInProgress',
    cloudAvailable: 'cloudAvailable',
    backoffMs: 'backoffMs',
    updatedAt: 'updatedAt'
  };

  export type SyncStateScalarFieldEnum = (typeof SyncStateScalarFieldEnum)[keyof typeof SyncStateScalarFieldEnum]


  export const PrinterConfigScalarFieldEnum: {
    id: 'id',
    name: 'name',
    displayName: 'displayName',
    type: 'type',
    connection: 'connection',
    address: 'address',
    vendorId: 'vendorId',
    productId: 'productId',
    paperWidth: 'paperWidth',
    isDefault: 'isDefault',
    isActive: 'isActive',
    isKitchen: 'isKitchen',
    isBilling: 'isBilling',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PrinterConfigScalarFieldEnum = (typeof PrinterConfigScalarFieldEnum)[keyof typeof PrinterConfigScalarFieldEnum]


  export const PrintHistoryScalarFieldEnum: {
    id: 'id',
    printerId: 'printerId',
    printType: 'printType',
    orderId: 'orderId',
    tableName: 'tableName',
    status: 'status',
    retryCount: 'retryCount',
    error: 'error',
    createdAt: 'createdAt'
  };

  export type PrintHistoryScalarFieldEnum = (typeof PrintHistoryScalarFieldEnum)[keyof typeof PrintHistoryScalarFieldEnum]


  export const LocalCredentialScalarFieldEnum: {
    id: 'id',
    phone: 'phone',
    passwordHash: 'passwordHash',
    pinHash: 'pinHash',
    name: 'name',
    role: 'role',
    imageUrl: 'imageUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LocalCredentialScalarFieldEnum = (typeof LocalCredentialScalarFieldEnum)[keyof typeof LocalCredentialScalarFieldEnum]


  export const CachedTableScalarFieldEnum: {
    id: 'id',
    name: 'name',
    areaId: 'areaId',
    areaName: 'areaName',
    capacity: 'capacity',
    status: 'status'
  };

  export type CachedTableScalarFieldEnum = (typeof CachedTableScalarFieldEnum)[keyof typeof CachedTableScalarFieldEnum]


  export const CachedCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    displayOrder: 'displayOrder',
    imageUrl: 'imageUrl',
    kitchenId: 'kitchenId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CachedCategoryScalarFieldEnum = (typeof CachedCategoryScalarFieldEnum)[keyof typeof CachedCategoryScalarFieldEnum]


  export const CachedAreaScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt'
  };

  export type CachedAreaScalarFieldEnum = (typeof CachedAreaScalarFieldEnum)[keyof typeof CachedAreaScalarFieldEnum]


  export const CachedItemScalarFieldEnum: {
    id: 'id',
    name: 'name',
    basePrice: 'basePrice',
    inStock: 'inStock',
    categoryId: 'categoryId',
    categoryName: 'categoryName',
    variations: 'variations',
    imageUrl: 'imageUrl'
  };

  export type CachedItemScalarFieldEnum = (typeof CachedItemScalarFieldEnum)[keyof typeof CachedItemScalarFieldEnum]


  export const CachedSettingScalarFieldEnum: {
    id: 'id',
    data: 'data'
  };

  export type CachedSettingScalarFieldEnum = (typeof CachedSettingScalarFieldEnum)[keyof typeof CachedSettingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type LocalOrderWhereInput = {
    AND?: LocalOrderWhereInput | LocalOrderWhereInput[]
    OR?: LocalOrderWhereInput[]
    NOT?: LocalOrderWhereInput | LocalOrderWhereInput[]
    id?: StringFilter<"LocalOrder"> | string
    tableId?: StringNullableFilter<"LocalOrder"> | string | null
    tableName?: StringNullableFilter<"LocalOrder"> | string | null
    customerId?: StringNullableFilter<"LocalOrder"> | string | null
    customerPhone?: StringNullableFilter<"LocalOrder"> | string | null
    guestCount?: IntFilter<"LocalOrder"> | number
    status?: StringFilter<"LocalOrder"> | string
    syncStatus?: StringFilter<"LocalOrder"> | string
    subtotal?: FloatFilter<"LocalOrder"> | number
    taxTotal?: FloatFilter<"LocalOrder"> | number
    discountTotal?: FloatFilter<"LocalOrder"> | number
    grandTotal?: FloatFilter<"LocalOrder"> | number
    orderType?: StringFilter<"LocalOrder"> | string
    note?: StringNullableFilter<"LocalOrder"> | string | null
    createdAt?: DateTimeFilter<"LocalOrder"> | Date | string
    updatedAt?: DateTimeFilter<"LocalOrder"> | Date | string
    items?: LocalOrderItemListRelationFilter
    kots?: LocalKOTListRelationFilter
    settlement?: XOR<LocalSettlementNullableScalarRelationFilter, LocalSettlementWhereInput> | null
  }

  export type LocalOrderOrderByWithRelationInput = {
    id?: SortOrder
    tableId?: SortOrderInput | SortOrder
    tableName?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    guestCount?: SortOrder
    status?: SortOrder
    syncStatus?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    orderType?: SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    items?: LocalOrderItemOrderByRelationAggregateInput
    kots?: LocalKOTOrderByRelationAggregateInput
    settlement?: LocalSettlementOrderByWithRelationInput
  }

  export type LocalOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LocalOrderWhereInput | LocalOrderWhereInput[]
    OR?: LocalOrderWhereInput[]
    NOT?: LocalOrderWhereInput | LocalOrderWhereInput[]
    tableId?: StringNullableFilter<"LocalOrder"> | string | null
    tableName?: StringNullableFilter<"LocalOrder"> | string | null
    customerId?: StringNullableFilter<"LocalOrder"> | string | null
    customerPhone?: StringNullableFilter<"LocalOrder"> | string | null
    guestCount?: IntFilter<"LocalOrder"> | number
    status?: StringFilter<"LocalOrder"> | string
    syncStatus?: StringFilter<"LocalOrder"> | string
    subtotal?: FloatFilter<"LocalOrder"> | number
    taxTotal?: FloatFilter<"LocalOrder"> | number
    discountTotal?: FloatFilter<"LocalOrder"> | number
    grandTotal?: FloatFilter<"LocalOrder"> | number
    orderType?: StringFilter<"LocalOrder"> | string
    note?: StringNullableFilter<"LocalOrder"> | string | null
    createdAt?: DateTimeFilter<"LocalOrder"> | Date | string
    updatedAt?: DateTimeFilter<"LocalOrder"> | Date | string
    items?: LocalOrderItemListRelationFilter
    kots?: LocalKOTListRelationFilter
    settlement?: XOR<LocalSettlementNullableScalarRelationFilter, LocalSettlementWhereInput> | null
  }, "id">

  export type LocalOrderOrderByWithAggregationInput = {
    id?: SortOrder
    tableId?: SortOrderInput | SortOrder
    tableName?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    guestCount?: SortOrder
    status?: SortOrder
    syncStatus?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    orderType?: SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocalOrderCountOrderByAggregateInput
    _avg?: LocalOrderAvgOrderByAggregateInput
    _max?: LocalOrderMaxOrderByAggregateInput
    _min?: LocalOrderMinOrderByAggregateInput
    _sum?: LocalOrderSumOrderByAggregateInput
  }

  export type LocalOrderScalarWhereWithAggregatesInput = {
    AND?: LocalOrderScalarWhereWithAggregatesInput | LocalOrderScalarWhereWithAggregatesInput[]
    OR?: LocalOrderScalarWhereWithAggregatesInput[]
    NOT?: LocalOrderScalarWhereWithAggregatesInput | LocalOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocalOrder"> | string
    tableId?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    tableName?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    customerId?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    customerPhone?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    guestCount?: IntWithAggregatesFilter<"LocalOrder"> | number
    status?: StringWithAggregatesFilter<"LocalOrder"> | string
    syncStatus?: StringWithAggregatesFilter<"LocalOrder"> | string
    subtotal?: FloatWithAggregatesFilter<"LocalOrder"> | number
    taxTotal?: FloatWithAggregatesFilter<"LocalOrder"> | number
    discountTotal?: FloatWithAggregatesFilter<"LocalOrder"> | number
    grandTotal?: FloatWithAggregatesFilter<"LocalOrder"> | number
    orderType?: StringWithAggregatesFilter<"LocalOrder"> | string
    note?: StringNullableWithAggregatesFilter<"LocalOrder"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LocalOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LocalOrder"> | Date | string
  }

  export type LocalOrderItemWhereInput = {
    AND?: LocalOrderItemWhereInput | LocalOrderItemWhereInput[]
    OR?: LocalOrderItemWhereInput[]
    NOT?: LocalOrderItemWhereInput | LocalOrderItemWhereInput[]
    id?: StringFilter<"LocalOrderItem"> | string
    orderId?: StringFilter<"LocalOrderItem"> | string
    itemId?: StringFilter<"LocalOrderItem"> | string
    itemName?: StringFilter<"LocalOrderItem"> | string
    variationId?: StringNullableFilter<"LocalOrderItem"> | string | null
    variationName?: StringNullableFilter<"LocalOrderItem"> | string | null
    kotId?: StringNullableFilter<"LocalOrderItem"> | string | null
    quantity?: IntFilter<"LocalOrderItem"> | number
    unitPrice?: FloatFilter<"LocalOrderItem"> | number
    lineTotal?: FloatFilter<"LocalOrderItem"> | number
    status?: StringFilter<"LocalOrderItem"> | string
    note?: StringNullableFilter<"LocalOrderItem"> | string | null
    order?: XOR<LocalOrderScalarRelationFilter, LocalOrderWhereInput>
    kot?: XOR<LocalKOTNullableScalarRelationFilter, LocalKOTWhereInput> | null
  }

  export type LocalOrderItemOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    itemId?: SortOrder
    itemName?: SortOrder
    variationId?: SortOrderInput | SortOrder
    variationName?: SortOrderInput | SortOrder
    kotId?: SortOrderInput | SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineTotal?: SortOrder
    status?: SortOrder
    note?: SortOrderInput | SortOrder
    order?: LocalOrderOrderByWithRelationInput
    kot?: LocalKOTOrderByWithRelationInput
  }

  export type LocalOrderItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LocalOrderItemWhereInput | LocalOrderItemWhereInput[]
    OR?: LocalOrderItemWhereInput[]
    NOT?: LocalOrderItemWhereInput | LocalOrderItemWhereInput[]
    orderId?: StringFilter<"LocalOrderItem"> | string
    itemId?: StringFilter<"LocalOrderItem"> | string
    itemName?: StringFilter<"LocalOrderItem"> | string
    variationId?: StringNullableFilter<"LocalOrderItem"> | string | null
    variationName?: StringNullableFilter<"LocalOrderItem"> | string | null
    kotId?: StringNullableFilter<"LocalOrderItem"> | string | null
    quantity?: IntFilter<"LocalOrderItem"> | number
    unitPrice?: FloatFilter<"LocalOrderItem"> | number
    lineTotal?: FloatFilter<"LocalOrderItem"> | number
    status?: StringFilter<"LocalOrderItem"> | string
    note?: StringNullableFilter<"LocalOrderItem"> | string | null
    order?: XOR<LocalOrderScalarRelationFilter, LocalOrderWhereInput>
    kot?: XOR<LocalKOTNullableScalarRelationFilter, LocalKOTWhereInput> | null
  }, "id">

  export type LocalOrderItemOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    itemId?: SortOrder
    itemName?: SortOrder
    variationId?: SortOrderInput | SortOrder
    variationName?: SortOrderInput | SortOrder
    kotId?: SortOrderInput | SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineTotal?: SortOrder
    status?: SortOrder
    note?: SortOrderInput | SortOrder
    _count?: LocalOrderItemCountOrderByAggregateInput
    _avg?: LocalOrderItemAvgOrderByAggregateInput
    _max?: LocalOrderItemMaxOrderByAggregateInput
    _min?: LocalOrderItemMinOrderByAggregateInput
    _sum?: LocalOrderItemSumOrderByAggregateInput
  }

  export type LocalOrderItemScalarWhereWithAggregatesInput = {
    AND?: LocalOrderItemScalarWhereWithAggregatesInput | LocalOrderItemScalarWhereWithAggregatesInput[]
    OR?: LocalOrderItemScalarWhereWithAggregatesInput[]
    NOT?: LocalOrderItemScalarWhereWithAggregatesInput | LocalOrderItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocalOrderItem"> | string
    orderId?: StringWithAggregatesFilter<"LocalOrderItem"> | string
    itemId?: StringWithAggregatesFilter<"LocalOrderItem"> | string
    itemName?: StringWithAggregatesFilter<"LocalOrderItem"> | string
    variationId?: StringNullableWithAggregatesFilter<"LocalOrderItem"> | string | null
    variationName?: StringNullableWithAggregatesFilter<"LocalOrderItem"> | string | null
    kotId?: StringNullableWithAggregatesFilter<"LocalOrderItem"> | string | null
    quantity?: IntWithAggregatesFilter<"LocalOrderItem"> | number
    unitPrice?: FloatWithAggregatesFilter<"LocalOrderItem"> | number
    lineTotal?: FloatWithAggregatesFilter<"LocalOrderItem"> | number
    status?: StringWithAggregatesFilter<"LocalOrderItem"> | string
    note?: StringNullableWithAggregatesFilter<"LocalOrderItem"> | string | null
  }

  export type LocalKOTWhereInput = {
    AND?: LocalKOTWhereInput | LocalKOTWhereInput[]
    OR?: LocalKOTWhereInput[]
    NOT?: LocalKOTWhereInput | LocalKOTWhereInput[]
    id?: StringFilter<"LocalKOT"> | string
    orderId?: StringFilter<"LocalKOT"> | string
    kotNumber?: IntFilter<"LocalKOT"> | number
    sentAt?: DateTimeFilter<"LocalKOT"> | Date | string
    sentBy?: StringFilter<"LocalKOT"> | string
    order?: XOR<LocalOrderScalarRelationFilter, LocalOrderWhereInput>
    items?: LocalOrderItemListRelationFilter
  }

  export type LocalKOTOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    kotNumber?: SortOrder
    sentAt?: SortOrder
    sentBy?: SortOrder
    order?: LocalOrderOrderByWithRelationInput
    items?: LocalOrderItemOrderByRelationAggregateInput
  }

  export type LocalKOTWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LocalKOTWhereInput | LocalKOTWhereInput[]
    OR?: LocalKOTWhereInput[]
    NOT?: LocalKOTWhereInput | LocalKOTWhereInput[]
    orderId?: StringFilter<"LocalKOT"> | string
    kotNumber?: IntFilter<"LocalKOT"> | number
    sentAt?: DateTimeFilter<"LocalKOT"> | Date | string
    sentBy?: StringFilter<"LocalKOT"> | string
    order?: XOR<LocalOrderScalarRelationFilter, LocalOrderWhereInput>
    items?: LocalOrderItemListRelationFilter
  }, "id">

  export type LocalKOTOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    kotNumber?: SortOrder
    sentAt?: SortOrder
    sentBy?: SortOrder
    _count?: LocalKOTCountOrderByAggregateInput
    _avg?: LocalKOTAvgOrderByAggregateInput
    _max?: LocalKOTMaxOrderByAggregateInput
    _min?: LocalKOTMinOrderByAggregateInput
    _sum?: LocalKOTSumOrderByAggregateInput
  }

  export type LocalKOTScalarWhereWithAggregatesInput = {
    AND?: LocalKOTScalarWhereWithAggregatesInput | LocalKOTScalarWhereWithAggregatesInput[]
    OR?: LocalKOTScalarWhereWithAggregatesInput[]
    NOT?: LocalKOTScalarWhereWithAggregatesInput | LocalKOTScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocalKOT"> | string
    orderId?: StringWithAggregatesFilter<"LocalKOT"> | string
    kotNumber?: IntWithAggregatesFilter<"LocalKOT"> | number
    sentAt?: DateTimeWithAggregatesFilter<"LocalKOT"> | Date | string
    sentBy?: StringWithAggregatesFilter<"LocalKOT"> | string
  }

  export type LocalSettlementWhereInput = {
    AND?: LocalSettlementWhereInput | LocalSettlementWhereInput[]
    OR?: LocalSettlementWhereInput[]
    NOT?: LocalSettlementWhereInput | LocalSettlementWhereInput[]
    id?: StringFilter<"LocalSettlement"> | string
    orderId?: StringFilter<"LocalSettlement"> | string
    subtotal?: FloatFilter<"LocalSettlement"> | number
    taxTotal?: FloatFilter<"LocalSettlement"> | number
    discountTotal?: FloatFilter<"LocalSettlement"> | number
    grandTotal?: FloatFilter<"LocalSettlement"> | number
    cashPaid?: FloatFilter<"LocalSettlement"> | number
    cardPaid?: FloatFilter<"LocalSettlement"> | number
    upiPaid?: FloatFilter<"LocalSettlement"> | number
    discountType?: StringNullableFilter<"LocalSettlement"> | string | null
    discountValue?: FloatNullableFilter<"LocalSettlement"> | number | null
    discountReason?: StringNullableFilter<"LocalSettlement"> | string | null
    changeGiven?: FloatFilter<"LocalSettlement"> | number
    settledAt?: DateTimeFilter<"LocalSettlement"> | Date | string
    order?: XOR<LocalOrderScalarRelationFilter, LocalOrderWhereInput>
  }

  export type LocalSettlementOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    cashPaid?: SortOrder
    cardPaid?: SortOrder
    upiPaid?: SortOrder
    discountType?: SortOrderInput | SortOrder
    discountValue?: SortOrderInput | SortOrder
    discountReason?: SortOrderInput | SortOrder
    changeGiven?: SortOrder
    settledAt?: SortOrder
    order?: LocalOrderOrderByWithRelationInput
  }

  export type LocalSettlementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderId?: string
    AND?: LocalSettlementWhereInput | LocalSettlementWhereInput[]
    OR?: LocalSettlementWhereInput[]
    NOT?: LocalSettlementWhereInput | LocalSettlementWhereInput[]
    subtotal?: FloatFilter<"LocalSettlement"> | number
    taxTotal?: FloatFilter<"LocalSettlement"> | number
    discountTotal?: FloatFilter<"LocalSettlement"> | number
    grandTotal?: FloatFilter<"LocalSettlement"> | number
    cashPaid?: FloatFilter<"LocalSettlement"> | number
    cardPaid?: FloatFilter<"LocalSettlement"> | number
    upiPaid?: FloatFilter<"LocalSettlement"> | number
    discountType?: StringNullableFilter<"LocalSettlement"> | string | null
    discountValue?: FloatNullableFilter<"LocalSettlement"> | number | null
    discountReason?: StringNullableFilter<"LocalSettlement"> | string | null
    changeGiven?: FloatFilter<"LocalSettlement"> | number
    settledAt?: DateTimeFilter<"LocalSettlement"> | Date | string
    order?: XOR<LocalOrderScalarRelationFilter, LocalOrderWhereInput>
  }, "id" | "orderId">

  export type LocalSettlementOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    cashPaid?: SortOrder
    cardPaid?: SortOrder
    upiPaid?: SortOrder
    discountType?: SortOrderInput | SortOrder
    discountValue?: SortOrderInput | SortOrder
    discountReason?: SortOrderInput | SortOrder
    changeGiven?: SortOrder
    settledAt?: SortOrder
    _count?: LocalSettlementCountOrderByAggregateInput
    _avg?: LocalSettlementAvgOrderByAggregateInput
    _max?: LocalSettlementMaxOrderByAggregateInput
    _min?: LocalSettlementMinOrderByAggregateInput
    _sum?: LocalSettlementSumOrderByAggregateInput
  }

  export type LocalSettlementScalarWhereWithAggregatesInput = {
    AND?: LocalSettlementScalarWhereWithAggregatesInput | LocalSettlementScalarWhereWithAggregatesInput[]
    OR?: LocalSettlementScalarWhereWithAggregatesInput[]
    NOT?: LocalSettlementScalarWhereWithAggregatesInput | LocalSettlementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocalSettlement"> | string
    orderId?: StringWithAggregatesFilter<"LocalSettlement"> | string
    subtotal?: FloatWithAggregatesFilter<"LocalSettlement"> | number
    taxTotal?: FloatWithAggregatesFilter<"LocalSettlement"> | number
    discountTotal?: FloatWithAggregatesFilter<"LocalSettlement"> | number
    grandTotal?: FloatWithAggregatesFilter<"LocalSettlement"> | number
    cashPaid?: FloatWithAggregatesFilter<"LocalSettlement"> | number
    cardPaid?: FloatWithAggregatesFilter<"LocalSettlement"> | number
    upiPaid?: FloatWithAggregatesFilter<"LocalSettlement"> | number
    discountType?: StringNullableWithAggregatesFilter<"LocalSettlement"> | string | null
    discountValue?: FloatNullableWithAggregatesFilter<"LocalSettlement"> | number | null
    discountReason?: StringNullableWithAggregatesFilter<"LocalSettlement"> | string | null
    changeGiven?: FloatWithAggregatesFilter<"LocalSettlement"> | number
    settledAt?: DateTimeWithAggregatesFilter<"LocalSettlement"> | Date | string
  }

  export type SyncQueueWhereInput = {
    AND?: SyncQueueWhereInput | SyncQueueWhereInput[]
    OR?: SyncQueueWhereInput[]
    NOT?: SyncQueueWhereInput | SyncQueueWhereInput[]
    id?: StringFilter<"SyncQueue"> | string
    action?: StringFilter<"SyncQueue"> | string
    payload?: StringFilter<"SyncQueue"> | string
    status?: StringFilter<"SyncQueue"> | string
    retryCount?: IntFilter<"SyncQueue"> | number
    retryAt?: DateTimeNullableFilter<"SyncQueue"> | Date | string | null
    error?: StringNullableFilter<"SyncQueue"> | string | null
    createdAt?: DateTimeFilter<"SyncQueue"> | Date | string
    updatedAt?: DateTimeFilter<"SyncQueue"> | Date | string
  }

  export type SyncQueueOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    retryAt?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncQueueWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SyncQueueWhereInput | SyncQueueWhereInput[]
    OR?: SyncQueueWhereInput[]
    NOT?: SyncQueueWhereInput | SyncQueueWhereInput[]
    action?: StringFilter<"SyncQueue"> | string
    payload?: StringFilter<"SyncQueue"> | string
    status?: StringFilter<"SyncQueue"> | string
    retryCount?: IntFilter<"SyncQueue"> | number
    retryAt?: DateTimeNullableFilter<"SyncQueue"> | Date | string | null
    error?: StringNullableFilter<"SyncQueue"> | string | null
    createdAt?: DateTimeFilter<"SyncQueue"> | Date | string
    updatedAt?: DateTimeFilter<"SyncQueue"> | Date | string
  }, "id">

  export type SyncQueueOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    retryAt?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SyncQueueCountOrderByAggregateInput
    _avg?: SyncQueueAvgOrderByAggregateInput
    _max?: SyncQueueMaxOrderByAggregateInput
    _min?: SyncQueueMinOrderByAggregateInput
    _sum?: SyncQueueSumOrderByAggregateInput
  }

  export type SyncQueueScalarWhereWithAggregatesInput = {
    AND?: SyncQueueScalarWhereWithAggregatesInput | SyncQueueScalarWhereWithAggregatesInput[]
    OR?: SyncQueueScalarWhereWithAggregatesInput[]
    NOT?: SyncQueueScalarWhereWithAggregatesInput | SyncQueueScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SyncQueue"> | string
    action?: StringWithAggregatesFilter<"SyncQueue"> | string
    payload?: StringWithAggregatesFilter<"SyncQueue"> | string
    status?: StringWithAggregatesFilter<"SyncQueue"> | string
    retryCount?: IntWithAggregatesFilter<"SyncQueue"> | number
    retryAt?: DateTimeNullableWithAggregatesFilter<"SyncQueue"> | Date | string | null
    error?: StringNullableWithAggregatesFilter<"SyncQueue"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SyncQueue"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SyncQueue"> | Date | string
  }

  export type SyncStateWhereInput = {
    AND?: SyncStateWhereInput | SyncStateWhereInput[]
    OR?: SyncStateWhereInput[]
    NOT?: SyncStateWhereInput | SyncStateWhereInput[]
    id?: StringFilter<"SyncState"> | string
    lastSyncAt?: DateTimeNullableFilter<"SyncState"> | Date | string | null
    pendingCount?: IntFilter<"SyncState"> | number
    syncInProgress?: BoolFilter<"SyncState"> | boolean
    cloudAvailable?: BoolFilter<"SyncState"> | boolean
    backoffMs?: IntFilter<"SyncState"> | number
    updatedAt?: DateTimeFilter<"SyncState"> | Date | string
  }

  export type SyncStateOrderByWithRelationInput = {
    id?: SortOrder
    lastSyncAt?: SortOrderInput | SortOrder
    pendingCount?: SortOrder
    syncInProgress?: SortOrder
    cloudAvailable?: SortOrder
    backoffMs?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncStateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SyncStateWhereInput | SyncStateWhereInput[]
    OR?: SyncStateWhereInput[]
    NOT?: SyncStateWhereInput | SyncStateWhereInput[]
    lastSyncAt?: DateTimeNullableFilter<"SyncState"> | Date | string | null
    pendingCount?: IntFilter<"SyncState"> | number
    syncInProgress?: BoolFilter<"SyncState"> | boolean
    cloudAvailable?: BoolFilter<"SyncState"> | boolean
    backoffMs?: IntFilter<"SyncState"> | number
    updatedAt?: DateTimeFilter<"SyncState"> | Date | string
  }, "id">

  export type SyncStateOrderByWithAggregationInput = {
    id?: SortOrder
    lastSyncAt?: SortOrderInput | SortOrder
    pendingCount?: SortOrder
    syncInProgress?: SortOrder
    cloudAvailable?: SortOrder
    backoffMs?: SortOrder
    updatedAt?: SortOrder
    _count?: SyncStateCountOrderByAggregateInput
    _avg?: SyncStateAvgOrderByAggregateInput
    _max?: SyncStateMaxOrderByAggregateInput
    _min?: SyncStateMinOrderByAggregateInput
    _sum?: SyncStateSumOrderByAggregateInput
  }

  export type SyncStateScalarWhereWithAggregatesInput = {
    AND?: SyncStateScalarWhereWithAggregatesInput | SyncStateScalarWhereWithAggregatesInput[]
    OR?: SyncStateScalarWhereWithAggregatesInput[]
    NOT?: SyncStateScalarWhereWithAggregatesInput | SyncStateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SyncState"> | string
    lastSyncAt?: DateTimeNullableWithAggregatesFilter<"SyncState"> | Date | string | null
    pendingCount?: IntWithAggregatesFilter<"SyncState"> | number
    syncInProgress?: BoolWithAggregatesFilter<"SyncState"> | boolean
    cloudAvailable?: BoolWithAggregatesFilter<"SyncState"> | boolean
    backoffMs?: IntWithAggregatesFilter<"SyncState"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"SyncState"> | Date | string
  }

  export type PrinterConfigWhereInput = {
    AND?: PrinterConfigWhereInput | PrinterConfigWhereInput[]
    OR?: PrinterConfigWhereInput[]
    NOT?: PrinterConfigWhereInput | PrinterConfigWhereInput[]
    id?: StringFilter<"PrinterConfig"> | string
    name?: StringFilter<"PrinterConfig"> | string
    displayName?: StringFilter<"PrinterConfig"> | string
    type?: StringFilter<"PrinterConfig"> | string
    connection?: StringFilter<"PrinterConfig"> | string
    address?: StringNullableFilter<"PrinterConfig"> | string | null
    vendorId?: IntNullableFilter<"PrinterConfig"> | number | null
    productId?: IntNullableFilter<"PrinterConfig"> | number | null
    paperWidth?: IntFilter<"PrinterConfig"> | number
    isDefault?: BoolFilter<"PrinterConfig"> | boolean
    isActive?: BoolFilter<"PrinterConfig"> | boolean
    isKitchen?: BoolFilter<"PrinterConfig"> | boolean
    isBilling?: BoolFilter<"PrinterConfig"> | boolean
    createdAt?: DateTimeFilter<"PrinterConfig"> | Date | string
    updatedAt?: DateTimeFilter<"PrinterConfig"> | Date | string
    printHistory?: PrintHistoryListRelationFilter
  }

  export type PrinterConfigOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    type?: SortOrder
    connection?: SortOrder
    address?: SortOrderInput | SortOrder
    vendorId?: SortOrderInput | SortOrder
    productId?: SortOrderInput | SortOrder
    paperWidth?: SortOrder
    isDefault?: SortOrder
    isActive?: SortOrder
    isKitchen?: SortOrder
    isBilling?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    printHistory?: PrintHistoryOrderByRelationAggregateInput
  }

  export type PrinterConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PrinterConfigWhereInput | PrinterConfigWhereInput[]
    OR?: PrinterConfigWhereInput[]
    NOT?: PrinterConfigWhereInput | PrinterConfigWhereInput[]
    name?: StringFilter<"PrinterConfig"> | string
    displayName?: StringFilter<"PrinterConfig"> | string
    type?: StringFilter<"PrinterConfig"> | string
    connection?: StringFilter<"PrinterConfig"> | string
    address?: StringNullableFilter<"PrinterConfig"> | string | null
    vendorId?: IntNullableFilter<"PrinterConfig"> | number | null
    productId?: IntNullableFilter<"PrinterConfig"> | number | null
    paperWidth?: IntFilter<"PrinterConfig"> | number
    isDefault?: BoolFilter<"PrinterConfig"> | boolean
    isActive?: BoolFilter<"PrinterConfig"> | boolean
    isKitchen?: BoolFilter<"PrinterConfig"> | boolean
    isBilling?: BoolFilter<"PrinterConfig"> | boolean
    createdAt?: DateTimeFilter<"PrinterConfig"> | Date | string
    updatedAt?: DateTimeFilter<"PrinterConfig"> | Date | string
    printHistory?: PrintHistoryListRelationFilter
  }, "id">

  export type PrinterConfigOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    type?: SortOrder
    connection?: SortOrder
    address?: SortOrderInput | SortOrder
    vendorId?: SortOrderInput | SortOrder
    productId?: SortOrderInput | SortOrder
    paperWidth?: SortOrder
    isDefault?: SortOrder
    isActive?: SortOrder
    isKitchen?: SortOrder
    isBilling?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PrinterConfigCountOrderByAggregateInput
    _avg?: PrinterConfigAvgOrderByAggregateInput
    _max?: PrinterConfigMaxOrderByAggregateInput
    _min?: PrinterConfigMinOrderByAggregateInput
    _sum?: PrinterConfigSumOrderByAggregateInput
  }

  export type PrinterConfigScalarWhereWithAggregatesInput = {
    AND?: PrinterConfigScalarWhereWithAggregatesInput | PrinterConfigScalarWhereWithAggregatesInput[]
    OR?: PrinterConfigScalarWhereWithAggregatesInput[]
    NOT?: PrinterConfigScalarWhereWithAggregatesInput | PrinterConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PrinterConfig"> | string
    name?: StringWithAggregatesFilter<"PrinterConfig"> | string
    displayName?: StringWithAggregatesFilter<"PrinterConfig"> | string
    type?: StringWithAggregatesFilter<"PrinterConfig"> | string
    connection?: StringWithAggregatesFilter<"PrinterConfig"> | string
    address?: StringNullableWithAggregatesFilter<"PrinterConfig"> | string | null
    vendorId?: IntNullableWithAggregatesFilter<"PrinterConfig"> | number | null
    productId?: IntNullableWithAggregatesFilter<"PrinterConfig"> | number | null
    paperWidth?: IntWithAggregatesFilter<"PrinterConfig"> | number
    isDefault?: BoolWithAggregatesFilter<"PrinterConfig"> | boolean
    isActive?: BoolWithAggregatesFilter<"PrinterConfig"> | boolean
    isKitchen?: BoolWithAggregatesFilter<"PrinterConfig"> | boolean
    isBilling?: BoolWithAggregatesFilter<"PrinterConfig"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"PrinterConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PrinterConfig"> | Date | string
  }

  export type PrintHistoryWhereInput = {
    AND?: PrintHistoryWhereInput | PrintHistoryWhereInput[]
    OR?: PrintHistoryWhereInput[]
    NOT?: PrintHistoryWhereInput | PrintHistoryWhereInput[]
    id?: StringFilter<"PrintHistory"> | string
    printerId?: StringFilter<"PrintHistory"> | string
    printType?: StringFilter<"PrintHistory"> | string
    orderId?: StringNullableFilter<"PrintHistory"> | string | null
    tableName?: StringNullableFilter<"PrintHistory"> | string | null
    status?: StringFilter<"PrintHistory"> | string
    retryCount?: IntFilter<"PrintHistory"> | number
    error?: StringNullableFilter<"PrintHistory"> | string | null
    createdAt?: DateTimeFilter<"PrintHistory"> | Date | string
    printer?: XOR<PrinterConfigScalarRelationFilter, PrinterConfigWhereInput>
  }

  export type PrintHistoryOrderByWithRelationInput = {
    id?: SortOrder
    printerId?: SortOrder
    printType?: SortOrder
    orderId?: SortOrderInput | SortOrder
    tableName?: SortOrderInput | SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    printer?: PrinterConfigOrderByWithRelationInput
  }

  export type PrintHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PrintHistoryWhereInput | PrintHistoryWhereInput[]
    OR?: PrintHistoryWhereInput[]
    NOT?: PrintHistoryWhereInput | PrintHistoryWhereInput[]
    printerId?: StringFilter<"PrintHistory"> | string
    printType?: StringFilter<"PrintHistory"> | string
    orderId?: StringNullableFilter<"PrintHistory"> | string | null
    tableName?: StringNullableFilter<"PrintHistory"> | string | null
    status?: StringFilter<"PrintHistory"> | string
    retryCount?: IntFilter<"PrintHistory"> | number
    error?: StringNullableFilter<"PrintHistory"> | string | null
    createdAt?: DateTimeFilter<"PrintHistory"> | Date | string
    printer?: XOR<PrinterConfigScalarRelationFilter, PrinterConfigWhereInput>
  }, "id">

  export type PrintHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    printerId?: SortOrder
    printType?: SortOrder
    orderId?: SortOrderInput | SortOrder
    tableName?: SortOrderInput | SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PrintHistoryCountOrderByAggregateInput
    _avg?: PrintHistoryAvgOrderByAggregateInput
    _max?: PrintHistoryMaxOrderByAggregateInput
    _min?: PrintHistoryMinOrderByAggregateInput
    _sum?: PrintHistorySumOrderByAggregateInput
  }

  export type PrintHistoryScalarWhereWithAggregatesInput = {
    AND?: PrintHistoryScalarWhereWithAggregatesInput | PrintHistoryScalarWhereWithAggregatesInput[]
    OR?: PrintHistoryScalarWhereWithAggregatesInput[]
    NOT?: PrintHistoryScalarWhereWithAggregatesInput | PrintHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PrintHistory"> | string
    printerId?: StringWithAggregatesFilter<"PrintHistory"> | string
    printType?: StringWithAggregatesFilter<"PrintHistory"> | string
    orderId?: StringNullableWithAggregatesFilter<"PrintHistory"> | string | null
    tableName?: StringNullableWithAggregatesFilter<"PrintHistory"> | string | null
    status?: StringWithAggregatesFilter<"PrintHistory"> | string
    retryCount?: IntWithAggregatesFilter<"PrintHistory"> | number
    error?: StringNullableWithAggregatesFilter<"PrintHistory"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PrintHistory"> | Date | string
  }

  export type LocalCredentialWhereInput = {
    AND?: LocalCredentialWhereInput | LocalCredentialWhereInput[]
    OR?: LocalCredentialWhereInput[]
    NOT?: LocalCredentialWhereInput | LocalCredentialWhereInput[]
    id?: StringFilter<"LocalCredential"> | string
    phone?: StringFilter<"LocalCredential"> | string
    passwordHash?: StringFilter<"LocalCredential"> | string
    pinHash?: StringNullableFilter<"LocalCredential"> | string | null
    name?: StringFilter<"LocalCredential"> | string
    role?: StringFilter<"LocalCredential"> | string
    imageUrl?: StringNullableFilter<"LocalCredential"> | string | null
    createdAt?: DateTimeFilter<"LocalCredential"> | Date | string
    updatedAt?: DateTimeFilter<"LocalCredential"> | Date | string
  }

  export type LocalCredentialOrderByWithRelationInput = {
    id?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    pinHash?: SortOrderInput | SortOrder
    name?: SortOrder
    role?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalCredentialWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phone?: string
    AND?: LocalCredentialWhereInput | LocalCredentialWhereInput[]
    OR?: LocalCredentialWhereInput[]
    NOT?: LocalCredentialWhereInput | LocalCredentialWhereInput[]
    passwordHash?: StringFilter<"LocalCredential"> | string
    pinHash?: StringNullableFilter<"LocalCredential"> | string | null
    name?: StringFilter<"LocalCredential"> | string
    role?: StringFilter<"LocalCredential"> | string
    imageUrl?: StringNullableFilter<"LocalCredential"> | string | null
    createdAt?: DateTimeFilter<"LocalCredential"> | Date | string
    updatedAt?: DateTimeFilter<"LocalCredential"> | Date | string
  }, "id" | "phone">

  export type LocalCredentialOrderByWithAggregationInput = {
    id?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    pinHash?: SortOrderInput | SortOrder
    name?: SortOrder
    role?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocalCredentialCountOrderByAggregateInput
    _max?: LocalCredentialMaxOrderByAggregateInput
    _min?: LocalCredentialMinOrderByAggregateInput
  }

  export type LocalCredentialScalarWhereWithAggregatesInput = {
    AND?: LocalCredentialScalarWhereWithAggregatesInput | LocalCredentialScalarWhereWithAggregatesInput[]
    OR?: LocalCredentialScalarWhereWithAggregatesInput[]
    NOT?: LocalCredentialScalarWhereWithAggregatesInput | LocalCredentialScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocalCredential"> | string
    phone?: StringWithAggregatesFilter<"LocalCredential"> | string
    passwordHash?: StringWithAggregatesFilter<"LocalCredential"> | string
    pinHash?: StringNullableWithAggregatesFilter<"LocalCredential"> | string | null
    name?: StringWithAggregatesFilter<"LocalCredential"> | string
    role?: StringWithAggregatesFilter<"LocalCredential"> | string
    imageUrl?: StringNullableWithAggregatesFilter<"LocalCredential"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LocalCredential"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LocalCredential"> | Date | string
  }

  export type CachedTableWhereInput = {
    AND?: CachedTableWhereInput | CachedTableWhereInput[]
    OR?: CachedTableWhereInput[]
    NOT?: CachedTableWhereInput | CachedTableWhereInput[]
    id?: StringFilter<"CachedTable"> | string
    name?: StringFilter<"CachedTable"> | string
    areaId?: StringNullableFilter<"CachedTable"> | string | null
    areaName?: StringNullableFilter<"CachedTable"> | string | null
    capacity?: IntFilter<"CachedTable"> | number
    status?: StringFilter<"CachedTable"> | string
  }

  export type CachedTableOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    areaId?: SortOrderInput | SortOrder
    areaName?: SortOrderInput | SortOrder
    capacity?: SortOrder
    status?: SortOrder
  }

  export type CachedTableWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CachedTableWhereInput | CachedTableWhereInput[]
    OR?: CachedTableWhereInput[]
    NOT?: CachedTableWhereInput | CachedTableWhereInput[]
    name?: StringFilter<"CachedTable"> | string
    areaId?: StringNullableFilter<"CachedTable"> | string | null
    areaName?: StringNullableFilter<"CachedTable"> | string | null
    capacity?: IntFilter<"CachedTable"> | number
    status?: StringFilter<"CachedTable"> | string
  }, "id">

  export type CachedTableOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    areaId?: SortOrderInput | SortOrder
    areaName?: SortOrderInput | SortOrder
    capacity?: SortOrder
    status?: SortOrder
    _count?: CachedTableCountOrderByAggregateInput
    _avg?: CachedTableAvgOrderByAggregateInput
    _max?: CachedTableMaxOrderByAggregateInput
    _min?: CachedTableMinOrderByAggregateInput
    _sum?: CachedTableSumOrderByAggregateInput
  }

  export type CachedTableScalarWhereWithAggregatesInput = {
    AND?: CachedTableScalarWhereWithAggregatesInput | CachedTableScalarWhereWithAggregatesInput[]
    OR?: CachedTableScalarWhereWithAggregatesInput[]
    NOT?: CachedTableScalarWhereWithAggregatesInput | CachedTableScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CachedTable"> | string
    name?: StringWithAggregatesFilter<"CachedTable"> | string
    areaId?: StringNullableWithAggregatesFilter<"CachedTable"> | string | null
    areaName?: StringNullableWithAggregatesFilter<"CachedTable"> | string | null
    capacity?: IntWithAggregatesFilter<"CachedTable"> | number
    status?: StringWithAggregatesFilter<"CachedTable"> | string
  }

  export type CachedCategoryWhereInput = {
    AND?: CachedCategoryWhereInput | CachedCategoryWhereInput[]
    OR?: CachedCategoryWhereInput[]
    NOT?: CachedCategoryWhereInput | CachedCategoryWhereInput[]
    id?: StringFilter<"CachedCategory"> | string
    name?: StringFilter<"CachedCategory"> | string
    displayOrder?: IntFilter<"CachedCategory"> | number
    imageUrl?: StringNullableFilter<"CachedCategory"> | string | null
    kitchenId?: StringNullableFilter<"CachedCategory"> | string | null
    createdAt?: DateTimeFilter<"CachedCategory"> | Date | string
    updatedAt?: DateTimeFilter<"CachedCategory"> | Date | string
  }

  export type CachedCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    displayOrder?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    kitchenId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CachedCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CachedCategoryWhereInput | CachedCategoryWhereInput[]
    OR?: CachedCategoryWhereInput[]
    NOT?: CachedCategoryWhereInput | CachedCategoryWhereInput[]
    name?: StringFilter<"CachedCategory"> | string
    displayOrder?: IntFilter<"CachedCategory"> | number
    imageUrl?: StringNullableFilter<"CachedCategory"> | string | null
    kitchenId?: StringNullableFilter<"CachedCategory"> | string | null
    createdAt?: DateTimeFilter<"CachedCategory"> | Date | string
    updatedAt?: DateTimeFilter<"CachedCategory"> | Date | string
  }, "id">

  export type CachedCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    displayOrder?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    kitchenId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CachedCategoryCountOrderByAggregateInput
    _avg?: CachedCategoryAvgOrderByAggregateInput
    _max?: CachedCategoryMaxOrderByAggregateInput
    _min?: CachedCategoryMinOrderByAggregateInput
    _sum?: CachedCategorySumOrderByAggregateInput
  }

  export type CachedCategoryScalarWhereWithAggregatesInput = {
    AND?: CachedCategoryScalarWhereWithAggregatesInput | CachedCategoryScalarWhereWithAggregatesInput[]
    OR?: CachedCategoryScalarWhereWithAggregatesInput[]
    NOT?: CachedCategoryScalarWhereWithAggregatesInput | CachedCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CachedCategory"> | string
    name?: StringWithAggregatesFilter<"CachedCategory"> | string
    displayOrder?: IntWithAggregatesFilter<"CachedCategory"> | number
    imageUrl?: StringNullableWithAggregatesFilter<"CachedCategory"> | string | null
    kitchenId?: StringNullableWithAggregatesFilter<"CachedCategory"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CachedCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CachedCategory"> | Date | string
  }

  export type CachedAreaWhereInput = {
    AND?: CachedAreaWhereInput | CachedAreaWhereInput[]
    OR?: CachedAreaWhereInput[]
    NOT?: CachedAreaWhereInput | CachedAreaWhereInput[]
    id?: StringFilter<"CachedArea"> | string
    name?: StringFilter<"CachedArea"> | string
    createdAt?: DateTimeFilter<"CachedArea"> | Date | string
  }

  export type CachedAreaOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type CachedAreaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CachedAreaWhereInput | CachedAreaWhereInput[]
    OR?: CachedAreaWhereInput[]
    NOT?: CachedAreaWhereInput | CachedAreaWhereInput[]
    name?: StringFilter<"CachedArea"> | string
    createdAt?: DateTimeFilter<"CachedArea"> | Date | string
  }, "id">

  export type CachedAreaOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    _count?: CachedAreaCountOrderByAggregateInput
    _max?: CachedAreaMaxOrderByAggregateInput
    _min?: CachedAreaMinOrderByAggregateInput
  }

  export type CachedAreaScalarWhereWithAggregatesInput = {
    AND?: CachedAreaScalarWhereWithAggregatesInput | CachedAreaScalarWhereWithAggregatesInput[]
    OR?: CachedAreaScalarWhereWithAggregatesInput[]
    NOT?: CachedAreaScalarWhereWithAggregatesInput | CachedAreaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CachedArea"> | string
    name?: StringWithAggregatesFilter<"CachedArea"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CachedArea"> | Date | string
  }

  export type CachedItemWhereInput = {
    AND?: CachedItemWhereInput | CachedItemWhereInput[]
    OR?: CachedItemWhereInput[]
    NOT?: CachedItemWhereInput | CachedItemWhereInput[]
    id?: StringFilter<"CachedItem"> | string
    name?: StringFilter<"CachedItem"> | string
    basePrice?: FloatFilter<"CachedItem"> | number
    inStock?: BoolFilter<"CachedItem"> | boolean
    categoryId?: StringNullableFilter<"CachedItem"> | string | null
    categoryName?: StringNullableFilter<"CachedItem"> | string | null
    variations?: StringFilter<"CachedItem"> | string
    imageUrl?: StringNullableFilter<"CachedItem"> | string | null
  }

  export type CachedItemOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    basePrice?: SortOrder
    inStock?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    categoryName?: SortOrderInput | SortOrder
    variations?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
  }

  export type CachedItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CachedItemWhereInput | CachedItemWhereInput[]
    OR?: CachedItemWhereInput[]
    NOT?: CachedItemWhereInput | CachedItemWhereInput[]
    name?: StringFilter<"CachedItem"> | string
    basePrice?: FloatFilter<"CachedItem"> | number
    inStock?: BoolFilter<"CachedItem"> | boolean
    categoryId?: StringNullableFilter<"CachedItem"> | string | null
    categoryName?: StringNullableFilter<"CachedItem"> | string | null
    variations?: StringFilter<"CachedItem"> | string
    imageUrl?: StringNullableFilter<"CachedItem"> | string | null
  }, "id">

  export type CachedItemOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    basePrice?: SortOrder
    inStock?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    categoryName?: SortOrderInput | SortOrder
    variations?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    _count?: CachedItemCountOrderByAggregateInput
    _avg?: CachedItemAvgOrderByAggregateInput
    _max?: CachedItemMaxOrderByAggregateInput
    _min?: CachedItemMinOrderByAggregateInput
    _sum?: CachedItemSumOrderByAggregateInput
  }

  export type CachedItemScalarWhereWithAggregatesInput = {
    AND?: CachedItemScalarWhereWithAggregatesInput | CachedItemScalarWhereWithAggregatesInput[]
    OR?: CachedItemScalarWhereWithAggregatesInput[]
    NOT?: CachedItemScalarWhereWithAggregatesInput | CachedItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CachedItem"> | string
    name?: StringWithAggregatesFilter<"CachedItem"> | string
    basePrice?: FloatWithAggregatesFilter<"CachedItem"> | number
    inStock?: BoolWithAggregatesFilter<"CachedItem"> | boolean
    categoryId?: StringNullableWithAggregatesFilter<"CachedItem"> | string | null
    categoryName?: StringNullableWithAggregatesFilter<"CachedItem"> | string | null
    variations?: StringWithAggregatesFilter<"CachedItem"> | string
    imageUrl?: StringNullableWithAggregatesFilter<"CachedItem"> | string | null
  }

  export type CachedSettingWhereInput = {
    AND?: CachedSettingWhereInput | CachedSettingWhereInput[]
    OR?: CachedSettingWhereInput[]
    NOT?: CachedSettingWhereInput | CachedSettingWhereInput[]
    id?: StringFilter<"CachedSetting"> | string
    data?: StringFilter<"CachedSetting"> | string
  }

  export type CachedSettingOrderByWithRelationInput = {
    id?: SortOrder
    data?: SortOrder
  }

  export type CachedSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CachedSettingWhereInput | CachedSettingWhereInput[]
    OR?: CachedSettingWhereInput[]
    NOT?: CachedSettingWhereInput | CachedSettingWhereInput[]
    data?: StringFilter<"CachedSetting"> | string
  }, "id">

  export type CachedSettingOrderByWithAggregationInput = {
    id?: SortOrder
    data?: SortOrder
    _count?: CachedSettingCountOrderByAggregateInput
    _max?: CachedSettingMaxOrderByAggregateInput
    _min?: CachedSettingMinOrderByAggregateInput
  }

  export type CachedSettingScalarWhereWithAggregatesInput = {
    AND?: CachedSettingScalarWhereWithAggregatesInput | CachedSettingScalarWhereWithAggregatesInput[]
    OR?: CachedSettingScalarWhereWithAggregatesInput[]
    NOT?: CachedSettingScalarWhereWithAggregatesInput | CachedSettingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CachedSetting"> | string
    data?: StringWithAggregatesFilter<"CachedSetting"> | string
  }

  export type LocalOrderCreateInput = {
    id?: string
    tableId?: string | null
    tableName?: string | null
    customerId?: string | null
    customerPhone?: string | null
    guestCount?: number
    status?: string
    syncStatus?: string
    subtotal?: number
    taxTotal?: number
    discountTotal?: number
    grandTotal?: number
    orderType?: string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: LocalOrderItemCreateNestedManyWithoutOrderInput
    kots?: LocalKOTCreateNestedManyWithoutOrderInput
    settlement?: LocalSettlementCreateNestedOneWithoutOrderInput
  }

  export type LocalOrderUncheckedCreateInput = {
    id?: string
    tableId?: string | null
    tableName?: string | null
    customerId?: string | null
    customerPhone?: string | null
    guestCount?: number
    status?: string
    syncStatus?: string
    subtotal?: number
    taxTotal?: number
    discountTotal?: number
    grandTotal?: number
    orderType?: string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: LocalOrderItemUncheckedCreateNestedManyWithoutOrderInput
    kots?: LocalKOTUncheckedCreateNestedManyWithoutOrderInput
    settlement?: LocalSettlementUncheckedCreateNestedOneWithoutOrderInput
  }

  export type LocalOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    syncStatus?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    orderType?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: LocalOrderItemUpdateManyWithoutOrderNestedInput
    kots?: LocalKOTUpdateManyWithoutOrderNestedInput
    settlement?: LocalSettlementUpdateOneWithoutOrderNestedInput
  }

  export type LocalOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    syncStatus?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    orderType?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: LocalOrderItemUncheckedUpdateManyWithoutOrderNestedInput
    kots?: LocalKOTUncheckedUpdateManyWithoutOrderNestedInput
    settlement?: LocalSettlementUncheckedUpdateOneWithoutOrderNestedInput
  }

  export type LocalOrderCreateManyInput = {
    id?: string
    tableId?: string | null
    tableName?: string | null
    customerId?: string | null
    customerPhone?: string | null
    guestCount?: number
    status?: string
    syncStatus?: string
    subtotal?: number
    taxTotal?: number
    discountTotal?: number
    grandTotal?: number
    orderType?: string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    syncStatus?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    orderType?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    syncStatus?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    orderType?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalOrderItemCreateInput = {
    id?: string
    itemId: string
    itemName: string
    variationId?: string | null
    variationName?: string | null
    quantity?: number
    unitPrice: number
    lineTotal: number
    status?: string
    note?: string | null
    order: LocalOrderCreateNestedOneWithoutItemsInput
    kot?: LocalKOTCreateNestedOneWithoutItemsInput
  }

  export type LocalOrderItemUncheckedCreateInput = {
    id?: string
    orderId: string
    itemId: string
    itemName: string
    variationId?: string | null
    variationName?: string | null
    kotId?: string | null
    quantity?: number
    unitPrice: number
    lineTotal: number
    status?: string
    note?: string | null
  }

  export type LocalOrderItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    variationId?: NullableStringFieldUpdateOperationsInput | string | null
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    order?: LocalOrderUpdateOneRequiredWithoutItemsNestedInput
    kot?: LocalKOTUpdateOneWithoutItemsNestedInput
  }

  export type LocalOrderItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    variationId?: NullableStringFieldUpdateOperationsInput | string | null
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    kotId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocalOrderItemCreateManyInput = {
    id?: string
    orderId: string
    itemId: string
    itemName: string
    variationId?: string | null
    variationName?: string | null
    kotId?: string | null
    quantity?: number
    unitPrice: number
    lineTotal: number
    status?: string
    note?: string | null
  }

  export type LocalOrderItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    variationId?: NullableStringFieldUpdateOperationsInput | string | null
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocalOrderItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    variationId?: NullableStringFieldUpdateOperationsInput | string | null
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    kotId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocalKOTCreateInput = {
    id?: string
    kotNumber: number
    sentAt?: Date | string
    sentBy: string
    order: LocalOrderCreateNestedOneWithoutKotsInput
    items?: LocalOrderItemCreateNestedManyWithoutKotInput
  }

  export type LocalKOTUncheckedCreateInput = {
    id?: string
    orderId: string
    kotNumber: number
    sentAt?: Date | string
    sentBy: string
    items?: LocalOrderItemUncheckedCreateNestedManyWithoutKotInput
  }

  export type LocalKOTUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kotNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentBy?: StringFieldUpdateOperationsInput | string
    order?: LocalOrderUpdateOneRequiredWithoutKotsNestedInput
    items?: LocalOrderItemUpdateManyWithoutKotNestedInput
  }

  export type LocalKOTUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    kotNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentBy?: StringFieldUpdateOperationsInput | string
    items?: LocalOrderItemUncheckedUpdateManyWithoutKotNestedInput
  }

  export type LocalKOTCreateManyInput = {
    id?: string
    orderId: string
    kotNumber: number
    sentAt?: Date | string
    sentBy: string
  }

  export type LocalKOTUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kotNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentBy?: StringFieldUpdateOperationsInput | string
  }

  export type LocalKOTUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    kotNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentBy?: StringFieldUpdateOperationsInput | string
  }

  export type LocalSettlementCreateInput = {
    id?: string
    subtotal: number
    taxTotal: number
    discountTotal: number
    grandTotal: number
    cashPaid?: number
    cardPaid?: number
    upiPaid?: number
    discountType?: string | null
    discountValue?: number | null
    discountReason?: string | null
    changeGiven?: number
    settledAt?: Date | string
    order: LocalOrderCreateNestedOneWithoutSettlementInput
  }

  export type LocalSettlementUncheckedCreateInput = {
    id?: string
    orderId: string
    subtotal: number
    taxTotal: number
    discountTotal: number
    grandTotal: number
    cashPaid?: number
    cardPaid?: number
    upiPaid?: number
    discountType?: string | null
    discountValue?: number | null
    discountReason?: string | null
    changeGiven?: number
    settledAt?: Date | string
  }

  export type LocalSettlementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    cashPaid?: FloatFieldUpdateOperationsInput | number
    cardPaid?: FloatFieldUpdateOperationsInput | number
    upiPaid?: FloatFieldUpdateOperationsInput | number
    discountType?: NullableStringFieldUpdateOperationsInput | string | null
    discountValue?: NullableFloatFieldUpdateOperationsInput | number | null
    discountReason?: NullableStringFieldUpdateOperationsInput | string | null
    changeGiven?: FloatFieldUpdateOperationsInput | number
    settledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: LocalOrderUpdateOneRequiredWithoutSettlementNestedInput
  }

  export type LocalSettlementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    cashPaid?: FloatFieldUpdateOperationsInput | number
    cardPaid?: FloatFieldUpdateOperationsInput | number
    upiPaid?: FloatFieldUpdateOperationsInput | number
    discountType?: NullableStringFieldUpdateOperationsInput | string | null
    discountValue?: NullableFloatFieldUpdateOperationsInput | number | null
    discountReason?: NullableStringFieldUpdateOperationsInput | string | null
    changeGiven?: FloatFieldUpdateOperationsInput | number
    settledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalSettlementCreateManyInput = {
    id?: string
    orderId: string
    subtotal: number
    taxTotal: number
    discountTotal: number
    grandTotal: number
    cashPaid?: number
    cardPaid?: number
    upiPaid?: number
    discountType?: string | null
    discountValue?: number | null
    discountReason?: string | null
    changeGiven?: number
    settledAt?: Date | string
  }

  export type LocalSettlementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    cashPaid?: FloatFieldUpdateOperationsInput | number
    cardPaid?: FloatFieldUpdateOperationsInput | number
    upiPaid?: FloatFieldUpdateOperationsInput | number
    discountType?: NullableStringFieldUpdateOperationsInput | string | null
    discountValue?: NullableFloatFieldUpdateOperationsInput | number | null
    discountReason?: NullableStringFieldUpdateOperationsInput | string | null
    changeGiven?: FloatFieldUpdateOperationsInput | number
    settledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalSettlementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    cashPaid?: FloatFieldUpdateOperationsInput | number
    cardPaid?: FloatFieldUpdateOperationsInput | number
    upiPaid?: FloatFieldUpdateOperationsInput | number
    discountType?: NullableStringFieldUpdateOperationsInput | string | null
    discountValue?: NullableFloatFieldUpdateOperationsInput | number | null
    discountReason?: NullableStringFieldUpdateOperationsInput | string | null
    changeGiven?: FloatFieldUpdateOperationsInput | number
    settledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncQueueCreateInput = {
    id?: string
    action: string
    payload: string
    status?: string
    retryCount?: number
    retryAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncQueueUncheckedCreateInput = {
    id?: string
    action: string
    payload: string
    status?: string
    retryCount?: number
    retryAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncQueueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    retryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncQueueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    retryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncQueueCreateManyInput = {
    id?: string
    action: string
    payload: string
    status?: string
    retryCount?: number
    retryAt?: Date | string | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncQueueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    retryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncQueueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    retryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncStateCreateInput = {
    id?: string
    lastSyncAt?: Date | string | null
    pendingCount?: number
    syncInProgress?: boolean
    cloudAvailable?: boolean
    backoffMs?: number
    updatedAt?: Date | string
  }

  export type SyncStateUncheckedCreateInput = {
    id?: string
    lastSyncAt?: Date | string | null
    pendingCount?: number
    syncInProgress?: boolean
    cloudAvailable?: boolean
    backoffMs?: number
    updatedAt?: Date | string
  }

  export type SyncStateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pendingCount?: IntFieldUpdateOperationsInput | number
    syncInProgress?: BoolFieldUpdateOperationsInput | boolean
    cloudAvailable?: BoolFieldUpdateOperationsInput | boolean
    backoffMs?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncStateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pendingCount?: IntFieldUpdateOperationsInput | number
    syncInProgress?: BoolFieldUpdateOperationsInput | boolean
    cloudAvailable?: BoolFieldUpdateOperationsInput | boolean
    backoffMs?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncStateCreateManyInput = {
    id?: string
    lastSyncAt?: Date | string | null
    pendingCount?: number
    syncInProgress?: boolean
    cloudAvailable?: boolean
    backoffMs?: number
    updatedAt?: Date | string
  }

  export type SyncStateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pendingCount?: IntFieldUpdateOperationsInput | number
    syncInProgress?: BoolFieldUpdateOperationsInput | boolean
    cloudAvailable?: BoolFieldUpdateOperationsInput | boolean
    backoffMs?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncStateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pendingCount?: IntFieldUpdateOperationsInput | number
    syncInProgress?: BoolFieldUpdateOperationsInput | boolean
    cloudAvailable?: BoolFieldUpdateOperationsInput | boolean
    backoffMs?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrinterConfigCreateInput = {
    id?: string
    name: string
    displayName: string
    type: string
    connection: string
    address?: string | null
    vendorId?: number | null
    productId?: number | null
    paperWidth?: number
    isDefault?: boolean
    isActive?: boolean
    isKitchen?: boolean
    isBilling?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    printHistory?: PrintHistoryCreateNestedManyWithoutPrinterInput
  }

  export type PrinterConfigUncheckedCreateInput = {
    id?: string
    name: string
    displayName: string
    type: string
    connection: string
    address?: string | null
    vendorId?: number | null
    productId?: number | null
    paperWidth?: number
    isDefault?: boolean
    isActive?: boolean
    isKitchen?: boolean
    isBilling?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    printHistory?: PrintHistoryUncheckedCreateNestedManyWithoutPrinterInput
  }

  export type PrinterConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    connection?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productId?: NullableIntFieldUpdateOperationsInput | number | null
    paperWidth?: IntFieldUpdateOperationsInput | number
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isKitchen?: BoolFieldUpdateOperationsInput | boolean
    isBilling?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    printHistory?: PrintHistoryUpdateManyWithoutPrinterNestedInput
  }

  export type PrinterConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    connection?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productId?: NullableIntFieldUpdateOperationsInput | number | null
    paperWidth?: IntFieldUpdateOperationsInput | number
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isKitchen?: BoolFieldUpdateOperationsInput | boolean
    isBilling?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    printHistory?: PrintHistoryUncheckedUpdateManyWithoutPrinterNestedInput
  }

  export type PrinterConfigCreateManyInput = {
    id?: string
    name: string
    displayName: string
    type: string
    connection: string
    address?: string | null
    vendorId?: number | null
    productId?: number | null
    paperWidth?: number
    isDefault?: boolean
    isActive?: boolean
    isKitchen?: boolean
    isBilling?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrinterConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    connection?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productId?: NullableIntFieldUpdateOperationsInput | number | null
    paperWidth?: IntFieldUpdateOperationsInput | number
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isKitchen?: BoolFieldUpdateOperationsInput | boolean
    isBilling?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrinterConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    connection?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productId?: NullableIntFieldUpdateOperationsInput | number | null
    paperWidth?: IntFieldUpdateOperationsInput | number
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isKitchen?: BoolFieldUpdateOperationsInput | boolean
    isBilling?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrintHistoryCreateInput = {
    id?: string
    printType: string
    orderId?: string | null
    tableName?: string | null
    status?: string
    retryCount?: number
    error?: string | null
    createdAt?: Date | string
    printer: PrinterConfigCreateNestedOneWithoutPrintHistoryInput
  }

  export type PrintHistoryUncheckedCreateInput = {
    id?: string
    printerId: string
    printType: string
    orderId?: string | null
    tableName?: string | null
    status?: string
    retryCount?: number
    error?: string | null
    createdAt?: Date | string
  }

  export type PrintHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    printType?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    printer?: PrinterConfigUpdateOneRequiredWithoutPrintHistoryNestedInput
  }

  export type PrintHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    printerId?: StringFieldUpdateOperationsInput | string
    printType?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrintHistoryCreateManyInput = {
    id?: string
    printerId: string
    printType: string
    orderId?: string | null
    tableName?: string | null
    status?: string
    retryCount?: number
    error?: string | null
    createdAt?: Date | string
  }

  export type PrintHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    printType?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrintHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    printerId?: StringFieldUpdateOperationsInput | string
    printType?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalCredentialCreateInput = {
    id?: string
    phone: string
    passwordHash: string
    pinHash?: string | null
    name?: string
    role?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalCredentialUncheckedCreateInput = {
    id?: string
    phone: string
    passwordHash: string
    pinHash?: string | null
    name?: string
    role?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalCredentialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalCredentialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalCredentialCreateManyInput = {
    id?: string
    phone: string
    passwordHash: string
    pinHash?: string | null
    name?: string
    role?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocalCredentialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalCredentialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedTableCreateInput = {
    id: string
    name: string
    areaId?: string | null
    areaName?: string | null
    capacity?: number
    status?: string
  }

  export type CachedTableUncheckedCreateInput = {
    id: string
    name: string
    areaId?: string | null
    areaName?: string | null
    capacity?: number
    status?: string
  }

  export type CachedTableUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    areaId?: NullableStringFieldUpdateOperationsInput | string | null
    areaName?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
  }

  export type CachedTableUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    areaId?: NullableStringFieldUpdateOperationsInput | string | null
    areaName?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
  }

  export type CachedTableCreateManyInput = {
    id: string
    name: string
    areaId?: string | null
    areaName?: string | null
    capacity?: number
    status?: string
  }

  export type CachedTableUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    areaId?: NullableStringFieldUpdateOperationsInput | string | null
    areaName?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
  }

  export type CachedTableUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    areaId?: NullableStringFieldUpdateOperationsInput | string | null
    areaName?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
  }

  export type CachedCategoryCreateInput = {
    id: string
    name: string
    displayOrder?: number
    imageUrl?: string | null
    kitchenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CachedCategoryUncheckedCreateInput = {
    id: string
    name: string
    displayOrder?: number
    imageUrl?: string | null
    kitchenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CachedCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kitchenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kitchenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedCategoryCreateManyInput = {
    id: string
    name: string
    displayOrder?: number
    imageUrl?: string | null
    kitchenId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CachedCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kitchenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayOrder?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kitchenId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedAreaCreateInput = {
    id: string
    name: string
    createdAt?: Date | string
  }

  export type CachedAreaUncheckedCreateInput = {
    id: string
    name: string
    createdAt?: Date | string
  }

  export type CachedAreaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedAreaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedAreaCreateManyInput = {
    id: string
    name: string
    createdAt?: Date | string
  }

  export type CachedAreaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedAreaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedItemCreateInput = {
    id: string
    name: string
    basePrice: number
    inStock?: boolean
    categoryId?: string | null
    categoryName?: string | null
    variations?: string
    imageUrl?: string | null
  }

  export type CachedItemUncheckedCreateInput = {
    id: string
    name: string
    basePrice: number
    inStock?: boolean
    categoryId?: string | null
    categoryName?: string | null
    variations?: string
    imageUrl?: string | null
  }

  export type CachedItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    basePrice?: FloatFieldUpdateOperationsInput | number
    inStock?: BoolFieldUpdateOperationsInput | boolean
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CachedItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    basePrice?: FloatFieldUpdateOperationsInput | number
    inStock?: BoolFieldUpdateOperationsInput | boolean
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CachedItemCreateManyInput = {
    id: string
    name: string
    basePrice: number
    inStock?: boolean
    categoryId?: string | null
    categoryName?: string | null
    variations?: string
    imageUrl?: string | null
  }

  export type CachedItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    basePrice?: FloatFieldUpdateOperationsInput | number
    inStock?: BoolFieldUpdateOperationsInput | boolean
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CachedItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    basePrice?: FloatFieldUpdateOperationsInput | number
    inStock?: BoolFieldUpdateOperationsInput | boolean
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryName?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CachedSettingCreateInput = {
    id?: string
    data: string
  }

  export type CachedSettingUncheckedCreateInput = {
    id?: string
    data: string
  }

  export type CachedSettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
  }

  export type CachedSettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
  }

  export type CachedSettingCreateManyInput = {
    id?: string
    data: string
  }

  export type CachedSettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
  }

  export type CachedSettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LocalOrderItemListRelationFilter = {
    every?: LocalOrderItemWhereInput
    some?: LocalOrderItemWhereInput
    none?: LocalOrderItemWhereInput
  }

  export type LocalKOTListRelationFilter = {
    every?: LocalKOTWhereInput
    some?: LocalKOTWhereInput
    none?: LocalKOTWhereInput
  }

  export type LocalSettlementNullableScalarRelationFilter = {
    is?: LocalSettlementWhereInput | null
    isNot?: LocalSettlementWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LocalOrderItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LocalKOTOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LocalOrderCountOrderByAggregateInput = {
    id?: SortOrder
    tableId?: SortOrder
    tableName?: SortOrder
    customerId?: SortOrder
    customerPhone?: SortOrder
    guestCount?: SortOrder
    status?: SortOrder
    syncStatus?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    orderType?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalOrderAvgOrderByAggregateInput = {
    guestCount?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
  }

  export type LocalOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    tableId?: SortOrder
    tableName?: SortOrder
    customerId?: SortOrder
    customerPhone?: SortOrder
    guestCount?: SortOrder
    status?: SortOrder
    syncStatus?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    orderType?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalOrderMinOrderByAggregateInput = {
    id?: SortOrder
    tableId?: SortOrder
    tableName?: SortOrder
    customerId?: SortOrder
    customerPhone?: SortOrder
    guestCount?: SortOrder
    status?: SortOrder
    syncStatus?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    orderType?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalOrderSumOrderByAggregateInput = {
    guestCount?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type LocalOrderScalarRelationFilter = {
    is?: LocalOrderWhereInput
    isNot?: LocalOrderWhereInput
  }

  export type LocalKOTNullableScalarRelationFilter = {
    is?: LocalKOTWhereInput | null
    isNot?: LocalKOTWhereInput | null
  }

  export type LocalOrderItemCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    itemId?: SortOrder
    itemName?: SortOrder
    variationId?: SortOrder
    variationName?: SortOrder
    kotId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineTotal?: SortOrder
    status?: SortOrder
    note?: SortOrder
  }

  export type LocalOrderItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineTotal?: SortOrder
  }

  export type LocalOrderItemMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    itemId?: SortOrder
    itemName?: SortOrder
    variationId?: SortOrder
    variationName?: SortOrder
    kotId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineTotal?: SortOrder
    status?: SortOrder
    note?: SortOrder
  }

  export type LocalOrderItemMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    itemId?: SortOrder
    itemName?: SortOrder
    variationId?: SortOrder
    variationName?: SortOrder
    kotId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineTotal?: SortOrder
    status?: SortOrder
    note?: SortOrder
  }

  export type LocalOrderItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineTotal?: SortOrder
  }

  export type LocalKOTCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    kotNumber?: SortOrder
    sentAt?: SortOrder
    sentBy?: SortOrder
  }

  export type LocalKOTAvgOrderByAggregateInput = {
    kotNumber?: SortOrder
  }

  export type LocalKOTMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    kotNumber?: SortOrder
    sentAt?: SortOrder
    sentBy?: SortOrder
  }

  export type LocalKOTMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    kotNumber?: SortOrder
    sentAt?: SortOrder
    sentBy?: SortOrder
  }

  export type LocalKOTSumOrderByAggregateInput = {
    kotNumber?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type LocalSettlementCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    cashPaid?: SortOrder
    cardPaid?: SortOrder
    upiPaid?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    discountReason?: SortOrder
    changeGiven?: SortOrder
    settledAt?: SortOrder
  }

  export type LocalSettlementAvgOrderByAggregateInput = {
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    cashPaid?: SortOrder
    cardPaid?: SortOrder
    upiPaid?: SortOrder
    discountValue?: SortOrder
    changeGiven?: SortOrder
  }

  export type LocalSettlementMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    cashPaid?: SortOrder
    cardPaid?: SortOrder
    upiPaid?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    discountReason?: SortOrder
    changeGiven?: SortOrder
    settledAt?: SortOrder
  }

  export type LocalSettlementMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    cashPaid?: SortOrder
    cardPaid?: SortOrder
    upiPaid?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    discountReason?: SortOrder
    changeGiven?: SortOrder
    settledAt?: SortOrder
  }

  export type LocalSettlementSumOrderByAggregateInput = {
    subtotal?: SortOrder
    taxTotal?: SortOrder
    discountTotal?: SortOrder
    grandTotal?: SortOrder
    cashPaid?: SortOrder
    cardPaid?: SortOrder
    upiPaid?: SortOrder
    discountValue?: SortOrder
    changeGiven?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SyncQueueCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    retryAt?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncQueueAvgOrderByAggregateInput = {
    retryCount?: SortOrder
  }

  export type SyncQueueMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    retryAt?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncQueueMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    retryAt?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncQueueSumOrderByAggregateInput = {
    retryCount?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SyncStateCountOrderByAggregateInput = {
    id?: SortOrder
    lastSyncAt?: SortOrder
    pendingCount?: SortOrder
    syncInProgress?: SortOrder
    cloudAvailable?: SortOrder
    backoffMs?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncStateAvgOrderByAggregateInput = {
    pendingCount?: SortOrder
    backoffMs?: SortOrder
  }

  export type SyncStateMaxOrderByAggregateInput = {
    id?: SortOrder
    lastSyncAt?: SortOrder
    pendingCount?: SortOrder
    syncInProgress?: SortOrder
    cloudAvailable?: SortOrder
    backoffMs?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncStateMinOrderByAggregateInput = {
    id?: SortOrder
    lastSyncAt?: SortOrder
    pendingCount?: SortOrder
    syncInProgress?: SortOrder
    cloudAvailable?: SortOrder
    backoffMs?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncStateSumOrderByAggregateInput = {
    pendingCount?: SortOrder
    backoffMs?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type PrintHistoryListRelationFilter = {
    every?: PrintHistoryWhereInput
    some?: PrintHistoryWhereInput
    none?: PrintHistoryWhereInput
  }

  export type PrintHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PrinterConfigCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    type?: SortOrder
    connection?: SortOrder
    address?: SortOrder
    vendorId?: SortOrder
    productId?: SortOrder
    paperWidth?: SortOrder
    isDefault?: SortOrder
    isActive?: SortOrder
    isKitchen?: SortOrder
    isBilling?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrinterConfigAvgOrderByAggregateInput = {
    vendorId?: SortOrder
    productId?: SortOrder
    paperWidth?: SortOrder
  }

  export type PrinterConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    type?: SortOrder
    connection?: SortOrder
    address?: SortOrder
    vendorId?: SortOrder
    productId?: SortOrder
    paperWidth?: SortOrder
    isDefault?: SortOrder
    isActive?: SortOrder
    isKitchen?: SortOrder
    isBilling?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrinterConfigMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    type?: SortOrder
    connection?: SortOrder
    address?: SortOrder
    vendorId?: SortOrder
    productId?: SortOrder
    paperWidth?: SortOrder
    isDefault?: SortOrder
    isActive?: SortOrder
    isKitchen?: SortOrder
    isBilling?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrinterConfigSumOrderByAggregateInput = {
    vendorId?: SortOrder
    productId?: SortOrder
    paperWidth?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type PrinterConfigScalarRelationFilter = {
    is?: PrinterConfigWhereInput
    isNot?: PrinterConfigWhereInput
  }

  export type PrintHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    printerId?: SortOrder
    printType?: SortOrder
    orderId?: SortOrder
    tableName?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type PrintHistoryAvgOrderByAggregateInput = {
    retryCount?: SortOrder
  }

  export type PrintHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    printerId?: SortOrder
    printType?: SortOrder
    orderId?: SortOrder
    tableName?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type PrintHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    printerId?: SortOrder
    printType?: SortOrder
    orderId?: SortOrder
    tableName?: SortOrder
    status?: SortOrder
    retryCount?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type PrintHistorySumOrderByAggregateInput = {
    retryCount?: SortOrder
  }

  export type LocalCredentialCountOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    pinHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalCredentialMaxOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    pinHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalCredentialMinOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    pinHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CachedTableCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    areaId?: SortOrder
    areaName?: SortOrder
    capacity?: SortOrder
    status?: SortOrder
  }

  export type CachedTableAvgOrderByAggregateInput = {
    capacity?: SortOrder
  }

  export type CachedTableMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    areaId?: SortOrder
    areaName?: SortOrder
    capacity?: SortOrder
    status?: SortOrder
  }

  export type CachedTableMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    areaId?: SortOrder
    areaName?: SortOrder
    capacity?: SortOrder
    status?: SortOrder
  }

  export type CachedTableSumOrderByAggregateInput = {
    capacity?: SortOrder
  }

  export type CachedCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayOrder?: SortOrder
    imageUrl?: SortOrder
    kitchenId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CachedCategoryAvgOrderByAggregateInput = {
    displayOrder?: SortOrder
  }

  export type CachedCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayOrder?: SortOrder
    imageUrl?: SortOrder
    kitchenId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CachedCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayOrder?: SortOrder
    imageUrl?: SortOrder
    kitchenId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CachedCategorySumOrderByAggregateInput = {
    displayOrder?: SortOrder
  }

  export type CachedAreaCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type CachedAreaMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type CachedAreaMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type CachedItemCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    basePrice?: SortOrder
    inStock?: SortOrder
    categoryId?: SortOrder
    categoryName?: SortOrder
    variations?: SortOrder
    imageUrl?: SortOrder
  }

  export type CachedItemAvgOrderByAggregateInput = {
    basePrice?: SortOrder
  }

  export type CachedItemMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    basePrice?: SortOrder
    inStock?: SortOrder
    categoryId?: SortOrder
    categoryName?: SortOrder
    variations?: SortOrder
    imageUrl?: SortOrder
  }

  export type CachedItemMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    basePrice?: SortOrder
    inStock?: SortOrder
    categoryId?: SortOrder
    categoryName?: SortOrder
    variations?: SortOrder
    imageUrl?: SortOrder
  }

  export type CachedItemSumOrderByAggregateInput = {
    basePrice?: SortOrder
  }

  export type CachedSettingCountOrderByAggregateInput = {
    id?: SortOrder
    data?: SortOrder
  }

  export type CachedSettingMaxOrderByAggregateInput = {
    id?: SortOrder
    data?: SortOrder
  }

  export type CachedSettingMinOrderByAggregateInput = {
    id?: SortOrder
    data?: SortOrder
  }

  export type LocalOrderItemCreateNestedManyWithoutOrderInput = {
    create?: XOR<LocalOrderItemCreateWithoutOrderInput, LocalOrderItemUncheckedCreateWithoutOrderInput> | LocalOrderItemCreateWithoutOrderInput[] | LocalOrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LocalOrderItemCreateOrConnectWithoutOrderInput | LocalOrderItemCreateOrConnectWithoutOrderInput[]
    createMany?: LocalOrderItemCreateManyOrderInputEnvelope
    connect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
  }

  export type LocalKOTCreateNestedManyWithoutOrderInput = {
    create?: XOR<LocalKOTCreateWithoutOrderInput, LocalKOTUncheckedCreateWithoutOrderInput> | LocalKOTCreateWithoutOrderInput[] | LocalKOTUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LocalKOTCreateOrConnectWithoutOrderInput | LocalKOTCreateOrConnectWithoutOrderInput[]
    createMany?: LocalKOTCreateManyOrderInputEnvelope
    connect?: LocalKOTWhereUniqueInput | LocalKOTWhereUniqueInput[]
  }

  export type LocalSettlementCreateNestedOneWithoutOrderInput = {
    create?: XOR<LocalSettlementCreateWithoutOrderInput, LocalSettlementUncheckedCreateWithoutOrderInput>
    connectOrCreate?: LocalSettlementCreateOrConnectWithoutOrderInput
    connect?: LocalSettlementWhereUniqueInput
  }

  export type LocalOrderItemUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<LocalOrderItemCreateWithoutOrderInput, LocalOrderItemUncheckedCreateWithoutOrderInput> | LocalOrderItemCreateWithoutOrderInput[] | LocalOrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LocalOrderItemCreateOrConnectWithoutOrderInput | LocalOrderItemCreateOrConnectWithoutOrderInput[]
    createMany?: LocalOrderItemCreateManyOrderInputEnvelope
    connect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
  }

  export type LocalKOTUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<LocalKOTCreateWithoutOrderInput, LocalKOTUncheckedCreateWithoutOrderInput> | LocalKOTCreateWithoutOrderInput[] | LocalKOTUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LocalKOTCreateOrConnectWithoutOrderInput | LocalKOTCreateOrConnectWithoutOrderInput[]
    createMany?: LocalKOTCreateManyOrderInputEnvelope
    connect?: LocalKOTWhereUniqueInput | LocalKOTWhereUniqueInput[]
  }

  export type LocalSettlementUncheckedCreateNestedOneWithoutOrderInput = {
    create?: XOR<LocalSettlementCreateWithoutOrderInput, LocalSettlementUncheckedCreateWithoutOrderInput>
    connectOrCreate?: LocalSettlementCreateOrConnectWithoutOrderInput
    connect?: LocalSettlementWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LocalOrderItemUpdateManyWithoutOrderNestedInput = {
    create?: XOR<LocalOrderItemCreateWithoutOrderInput, LocalOrderItemUncheckedCreateWithoutOrderInput> | LocalOrderItemCreateWithoutOrderInput[] | LocalOrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LocalOrderItemCreateOrConnectWithoutOrderInput | LocalOrderItemCreateOrConnectWithoutOrderInput[]
    upsert?: LocalOrderItemUpsertWithWhereUniqueWithoutOrderInput | LocalOrderItemUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: LocalOrderItemCreateManyOrderInputEnvelope
    set?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    disconnect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    delete?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    connect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    update?: LocalOrderItemUpdateWithWhereUniqueWithoutOrderInput | LocalOrderItemUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: LocalOrderItemUpdateManyWithWhereWithoutOrderInput | LocalOrderItemUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: LocalOrderItemScalarWhereInput | LocalOrderItemScalarWhereInput[]
  }

  export type LocalKOTUpdateManyWithoutOrderNestedInput = {
    create?: XOR<LocalKOTCreateWithoutOrderInput, LocalKOTUncheckedCreateWithoutOrderInput> | LocalKOTCreateWithoutOrderInput[] | LocalKOTUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LocalKOTCreateOrConnectWithoutOrderInput | LocalKOTCreateOrConnectWithoutOrderInput[]
    upsert?: LocalKOTUpsertWithWhereUniqueWithoutOrderInput | LocalKOTUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: LocalKOTCreateManyOrderInputEnvelope
    set?: LocalKOTWhereUniqueInput | LocalKOTWhereUniqueInput[]
    disconnect?: LocalKOTWhereUniqueInput | LocalKOTWhereUniqueInput[]
    delete?: LocalKOTWhereUniqueInput | LocalKOTWhereUniqueInput[]
    connect?: LocalKOTWhereUniqueInput | LocalKOTWhereUniqueInput[]
    update?: LocalKOTUpdateWithWhereUniqueWithoutOrderInput | LocalKOTUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: LocalKOTUpdateManyWithWhereWithoutOrderInput | LocalKOTUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: LocalKOTScalarWhereInput | LocalKOTScalarWhereInput[]
  }

  export type LocalSettlementUpdateOneWithoutOrderNestedInput = {
    create?: XOR<LocalSettlementCreateWithoutOrderInput, LocalSettlementUncheckedCreateWithoutOrderInput>
    connectOrCreate?: LocalSettlementCreateOrConnectWithoutOrderInput
    upsert?: LocalSettlementUpsertWithoutOrderInput
    disconnect?: LocalSettlementWhereInput | boolean
    delete?: LocalSettlementWhereInput | boolean
    connect?: LocalSettlementWhereUniqueInput
    update?: XOR<XOR<LocalSettlementUpdateToOneWithWhereWithoutOrderInput, LocalSettlementUpdateWithoutOrderInput>, LocalSettlementUncheckedUpdateWithoutOrderInput>
  }

  export type LocalOrderItemUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<LocalOrderItemCreateWithoutOrderInput, LocalOrderItemUncheckedCreateWithoutOrderInput> | LocalOrderItemCreateWithoutOrderInput[] | LocalOrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LocalOrderItemCreateOrConnectWithoutOrderInput | LocalOrderItemCreateOrConnectWithoutOrderInput[]
    upsert?: LocalOrderItemUpsertWithWhereUniqueWithoutOrderInput | LocalOrderItemUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: LocalOrderItemCreateManyOrderInputEnvelope
    set?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    disconnect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    delete?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    connect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    update?: LocalOrderItemUpdateWithWhereUniqueWithoutOrderInput | LocalOrderItemUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: LocalOrderItemUpdateManyWithWhereWithoutOrderInput | LocalOrderItemUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: LocalOrderItemScalarWhereInput | LocalOrderItemScalarWhereInput[]
  }

  export type LocalKOTUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<LocalKOTCreateWithoutOrderInput, LocalKOTUncheckedCreateWithoutOrderInput> | LocalKOTCreateWithoutOrderInput[] | LocalKOTUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LocalKOTCreateOrConnectWithoutOrderInput | LocalKOTCreateOrConnectWithoutOrderInput[]
    upsert?: LocalKOTUpsertWithWhereUniqueWithoutOrderInput | LocalKOTUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: LocalKOTCreateManyOrderInputEnvelope
    set?: LocalKOTWhereUniqueInput | LocalKOTWhereUniqueInput[]
    disconnect?: LocalKOTWhereUniqueInput | LocalKOTWhereUniqueInput[]
    delete?: LocalKOTWhereUniqueInput | LocalKOTWhereUniqueInput[]
    connect?: LocalKOTWhereUniqueInput | LocalKOTWhereUniqueInput[]
    update?: LocalKOTUpdateWithWhereUniqueWithoutOrderInput | LocalKOTUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: LocalKOTUpdateManyWithWhereWithoutOrderInput | LocalKOTUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: LocalKOTScalarWhereInput | LocalKOTScalarWhereInput[]
  }

  export type LocalSettlementUncheckedUpdateOneWithoutOrderNestedInput = {
    create?: XOR<LocalSettlementCreateWithoutOrderInput, LocalSettlementUncheckedCreateWithoutOrderInput>
    connectOrCreate?: LocalSettlementCreateOrConnectWithoutOrderInput
    upsert?: LocalSettlementUpsertWithoutOrderInput
    disconnect?: LocalSettlementWhereInput | boolean
    delete?: LocalSettlementWhereInput | boolean
    connect?: LocalSettlementWhereUniqueInput
    update?: XOR<XOR<LocalSettlementUpdateToOneWithWhereWithoutOrderInput, LocalSettlementUpdateWithoutOrderInput>, LocalSettlementUncheckedUpdateWithoutOrderInput>
  }

  export type LocalOrderCreateNestedOneWithoutItemsInput = {
    create?: XOR<LocalOrderCreateWithoutItemsInput, LocalOrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: LocalOrderCreateOrConnectWithoutItemsInput
    connect?: LocalOrderWhereUniqueInput
  }

  export type LocalKOTCreateNestedOneWithoutItemsInput = {
    create?: XOR<LocalKOTCreateWithoutItemsInput, LocalKOTUncheckedCreateWithoutItemsInput>
    connectOrCreate?: LocalKOTCreateOrConnectWithoutItemsInput
    connect?: LocalKOTWhereUniqueInput
  }

  export type LocalOrderUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<LocalOrderCreateWithoutItemsInput, LocalOrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: LocalOrderCreateOrConnectWithoutItemsInput
    upsert?: LocalOrderUpsertWithoutItemsInput
    connect?: LocalOrderWhereUniqueInput
    update?: XOR<XOR<LocalOrderUpdateToOneWithWhereWithoutItemsInput, LocalOrderUpdateWithoutItemsInput>, LocalOrderUncheckedUpdateWithoutItemsInput>
  }

  export type LocalKOTUpdateOneWithoutItemsNestedInput = {
    create?: XOR<LocalKOTCreateWithoutItemsInput, LocalKOTUncheckedCreateWithoutItemsInput>
    connectOrCreate?: LocalKOTCreateOrConnectWithoutItemsInput
    upsert?: LocalKOTUpsertWithoutItemsInput
    disconnect?: LocalKOTWhereInput | boolean
    delete?: LocalKOTWhereInput | boolean
    connect?: LocalKOTWhereUniqueInput
    update?: XOR<XOR<LocalKOTUpdateToOneWithWhereWithoutItemsInput, LocalKOTUpdateWithoutItemsInput>, LocalKOTUncheckedUpdateWithoutItemsInput>
  }

  export type LocalOrderCreateNestedOneWithoutKotsInput = {
    create?: XOR<LocalOrderCreateWithoutKotsInput, LocalOrderUncheckedCreateWithoutKotsInput>
    connectOrCreate?: LocalOrderCreateOrConnectWithoutKotsInput
    connect?: LocalOrderWhereUniqueInput
  }

  export type LocalOrderItemCreateNestedManyWithoutKotInput = {
    create?: XOR<LocalOrderItemCreateWithoutKotInput, LocalOrderItemUncheckedCreateWithoutKotInput> | LocalOrderItemCreateWithoutKotInput[] | LocalOrderItemUncheckedCreateWithoutKotInput[]
    connectOrCreate?: LocalOrderItemCreateOrConnectWithoutKotInput | LocalOrderItemCreateOrConnectWithoutKotInput[]
    createMany?: LocalOrderItemCreateManyKotInputEnvelope
    connect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
  }

  export type LocalOrderItemUncheckedCreateNestedManyWithoutKotInput = {
    create?: XOR<LocalOrderItemCreateWithoutKotInput, LocalOrderItemUncheckedCreateWithoutKotInput> | LocalOrderItemCreateWithoutKotInput[] | LocalOrderItemUncheckedCreateWithoutKotInput[]
    connectOrCreate?: LocalOrderItemCreateOrConnectWithoutKotInput | LocalOrderItemCreateOrConnectWithoutKotInput[]
    createMany?: LocalOrderItemCreateManyKotInputEnvelope
    connect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
  }

  export type LocalOrderUpdateOneRequiredWithoutKotsNestedInput = {
    create?: XOR<LocalOrderCreateWithoutKotsInput, LocalOrderUncheckedCreateWithoutKotsInput>
    connectOrCreate?: LocalOrderCreateOrConnectWithoutKotsInput
    upsert?: LocalOrderUpsertWithoutKotsInput
    connect?: LocalOrderWhereUniqueInput
    update?: XOR<XOR<LocalOrderUpdateToOneWithWhereWithoutKotsInput, LocalOrderUpdateWithoutKotsInput>, LocalOrderUncheckedUpdateWithoutKotsInput>
  }

  export type LocalOrderItemUpdateManyWithoutKotNestedInput = {
    create?: XOR<LocalOrderItemCreateWithoutKotInput, LocalOrderItemUncheckedCreateWithoutKotInput> | LocalOrderItemCreateWithoutKotInput[] | LocalOrderItemUncheckedCreateWithoutKotInput[]
    connectOrCreate?: LocalOrderItemCreateOrConnectWithoutKotInput | LocalOrderItemCreateOrConnectWithoutKotInput[]
    upsert?: LocalOrderItemUpsertWithWhereUniqueWithoutKotInput | LocalOrderItemUpsertWithWhereUniqueWithoutKotInput[]
    createMany?: LocalOrderItemCreateManyKotInputEnvelope
    set?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    disconnect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    delete?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    connect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    update?: LocalOrderItemUpdateWithWhereUniqueWithoutKotInput | LocalOrderItemUpdateWithWhereUniqueWithoutKotInput[]
    updateMany?: LocalOrderItemUpdateManyWithWhereWithoutKotInput | LocalOrderItemUpdateManyWithWhereWithoutKotInput[]
    deleteMany?: LocalOrderItemScalarWhereInput | LocalOrderItemScalarWhereInput[]
  }

  export type LocalOrderItemUncheckedUpdateManyWithoutKotNestedInput = {
    create?: XOR<LocalOrderItemCreateWithoutKotInput, LocalOrderItemUncheckedCreateWithoutKotInput> | LocalOrderItemCreateWithoutKotInput[] | LocalOrderItemUncheckedCreateWithoutKotInput[]
    connectOrCreate?: LocalOrderItemCreateOrConnectWithoutKotInput | LocalOrderItemCreateOrConnectWithoutKotInput[]
    upsert?: LocalOrderItemUpsertWithWhereUniqueWithoutKotInput | LocalOrderItemUpsertWithWhereUniqueWithoutKotInput[]
    createMany?: LocalOrderItemCreateManyKotInputEnvelope
    set?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    disconnect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    delete?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    connect?: LocalOrderItemWhereUniqueInput | LocalOrderItemWhereUniqueInput[]
    update?: LocalOrderItemUpdateWithWhereUniqueWithoutKotInput | LocalOrderItemUpdateWithWhereUniqueWithoutKotInput[]
    updateMany?: LocalOrderItemUpdateManyWithWhereWithoutKotInput | LocalOrderItemUpdateManyWithWhereWithoutKotInput[]
    deleteMany?: LocalOrderItemScalarWhereInput | LocalOrderItemScalarWhereInput[]
  }

  export type LocalOrderCreateNestedOneWithoutSettlementInput = {
    create?: XOR<LocalOrderCreateWithoutSettlementInput, LocalOrderUncheckedCreateWithoutSettlementInput>
    connectOrCreate?: LocalOrderCreateOrConnectWithoutSettlementInput
    connect?: LocalOrderWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LocalOrderUpdateOneRequiredWithoutSettlementNestedInput = {
    create?: XOR<LocalOrderCreateWithoutSettlementInput, LocalOrderUncheckedCreateWithoutSettlementInput>
    connectOrCreate?: LocalOrderCreateOrConnectWithoutSettlementInput
    upsert?: LocalOrderUpsertWithoutSettlementInput
    connect?: LocalOrderWhereUniqueInput
    update?: XOR<XOR<LocalOrderUpdateToOneWithWhereWithoutSettlementInput, LocalOrderUpdateWithoutSettlementInput>, LocalOrderUncheckedUpdateWithoutSettlementInput>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type PrintHistoryCreateNestedManyWithoutPrinterInput = {
    create?: XOR<PrintHistoryCreateWithoutPrinterInput, PrintHistoryUncheckedCreateWithoutPrinterInput> | PrintHistoryCreateWithoutPrinterInput[] | PrintHistoryUncheckedCreateWithoutPrinterInput[]
    connectOrCreate?: PrintHistoryCreateOrConnectWithoutPrinterInput | PrintHistoryCreateOrConnectWithoutPrinterInput[]
    createMany?: PrintHistoryCreateManyPrinterInputEnvelope
    connect?: PrintHistoryWhereUniqueInput | PrintHistoryWhereUniqueInput[]
  }

  export type PrintHistoryUncheckedCreateNestedManyWithoutPrinterInput = {
    create?: XOR<PrintHistoryCreateWithoutPrinterInput, PrintHistoryUncheckedCreateWithoutPrinterInput> | PrintHistoryCreateWithoutPrinterInput[] | PrintHistoryUncheckedCreateWithoutPrinterInput[]
    connectOrCreate?: PrintHistoryCreateOrConnectWithoutPrinterInput | PrintHistoryCreateOrConnectWithoutPrinterInput[]
    createMany?: PrintHistoryCreateManyPrinterInputEnvelope
    connect?: PrintHistoryWhereUniqueInput | PrintHistoryWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PrintHistoryUpdateManyWithoutPrinterNestedInput = {
    create?: XOR<PrintHistoryCreateWithoutPrinterInput, PrintHistoryUncheckedCreateWithoutPrinterInput> | PrintHistoryCreateWithoutPrinterInput[] | PrintHistoryUncheckedCreateWithoutPrinterInput[]
    connectOrCreate?: PrintHistoryCreateOrConnectWithoutPrinterInput | PrintHistoryCreateOrConnectWithoutPrinterInput[]
    upsert?: PrintHistoryUpsertWithWhereUniqueWithoutPrinterInput | PrintHistoryUpsertWithWhereUniqueWithoutPrinterInput[]
    createMany?: PrintHistoryCreateManyPrinterInputEnvelope
    set?: PrintHistoryWhereUniqueInput | PrintHistoryWhereUniqueInput[]
    disconnect?: PrintHistoryWhereUniqueInput | PrintHistoryWhereUniqueInput[]
    delete?: PrintHistoryWhereUniqueInput | PrintHistoryWhereUniqueInput[]
    connect?: PrintHistoryWhereUniqueInput | PrintHistoryWhereUniqueInput[]
    update?: PrintHistoryUpdateWithWhereUniqueWithoutPrinterInput | PrintHistoryUpdateWithWhereUniqueWithoutPrinterInput[]
    updateMany?: PrintHistoryUpdateManyWithWhereWithoutPrinterInput | PrintHistoryUpdateManyWithWhereWithoutPrinterInput[]
    deleteMany?: PrintHistoryScalarWhereInput | PrintHistoryScalarWhereInput[]
  }

  export type PrintHistoryUncheckedUpdateManyWithoutPrinterNestedInput = {
    create?: XOR<PrintHistoryCreateWithoutPrinterInput, PrintHistoryUncheckedCreateWithoutPrinterInput> | PrintHistoryCreateWithoutPrinterInput[] | PrintHistoryUncheckedCreateWithoutPrinterInput[]
    connectOrCreate?: PrintHistoryCreateOrConnectWithoutPrinterInput | PrintHistoryCreateOrConnectWithoutPrinterInput[]
    upsert?: PrintHistoryUpsertWithWhereUniqueWithoutPrinterInput | PrintHistoryUpsertWithWhereUniqueWithoutPrinterInput[]
    createMany?: PrintHistoryCreateManyPrinterInputEnvelope
    set?: PrintHistoryWhereUniqueInput | PrintHistoryWhereUniqueInput[]
    disconnect?: PrintHistoryWhereUniqueInput | PrintHistoryWhereUniqueInput[]
    delete?: PrintHistoryWhereUniqueInput | PrintHistoryWhereUniqueInput[]
    connect?: PrintHistoryWhereUniqueInput | PrintHistoryWhereUniqueInput[]
    update?: PrintHistoryUpdateWithWhereUniqueWithoutPrinterInput | PrintHistoryUpdateWithWhereUniqueWithoutPrinterInput[]
    updateMany?: PrintHistoryUpdateManyWithWhereWithoutPrinterInput | PrintHistoryUpdateManyWithWhereWithoutPrinterInput[]
    deleteMany?: PrintHistoryScalarWhereInput | PrintHistoryScalarWhereInput[]
  }

  export type PrinterConfigCreateNestedOneWithoutPrintHistoryInput = {
    create?: XOR<PrinterConfigCreateWithoutPrintHistoryInput, PrinterConfigUncheckedCreateWithoutPrintHistoryInput>
    connectOrCreate?: PrinterConfigCreateOrConnectWithoutPrintHistoryInput
    connect?: PrinterConfigWhereUniqueInput
  }

  export type PrinterConfigUpdateOneRequiredWithoutPrintHistoryNestedInput = {
    create?: XOR<PrinterConfigCreateWithoutPrintHistoryInput, PrinterConfigUncheckedCreateWithoutPrintHistoryInput>
    connectOrCreate?: PrinterConfigCreateOrConnectWithoutPrintHistoryInput
    upsert?: PrinterConfigUpsertWithoutPrintHistoryInput
    connect?: PrinterConfigWhereUniqueInput
    update?: XOR<XOR<PrinterConfigUpdateToOneWithWhereWithoutPrintHistoryInput, PrinterConfigUpdateWithoutPrintHistoryInput>, PrinterConfigUncheckedUpdateWithoutPrintHistoryInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type LocalOrderItemCreateWithoutOrderInput = {
    id?: string
    itemId: string
    itemName: string
    variationId?: string | null
    variationName?: string | null
    quantity?: number
    unitPrice: number
    lineTotal: number
    status?: string
    note?: string | null
    kot?: LocalKOTCreateNestedOneWithoutItemsInput
  }

  export type LocalOrderItemUncheckedCreateWithoutOrderInput = {
    id?: string
    itemId: string
    itemName: string
    variationId?: string | null
    variationName?: string | null
    kotId?: string | null
    quantity?: number
    unitPrice: number
    lineTotal: number
    status?: string
    note?: string | null
  }

  export type LocalOrderItemCreateOrConnectWithoutOrderInput = {
    where: LocalOrderItemWhereUniqueInput
    create: XOR<LocalOrderItemCreateWithoutOrderInput, LocalOrderItemUncheckedCreateWithoutOrderInput>
  }

  export type LocalOrderItemCreateManyOrderInputEnvelope = {
    data: LocalOrderItemCreateManyOrderInput | LocalOrderItemCreateManyOrderInput[]
  }

  export type LocalKOTCreateWithoutOrderInput = {
    id?: string
    kotNumber: number
    sentAt?: Date | string
    sentBy: string
    items?: LocalOrderItemCreateNestedManyWithoutKotInput
  }

  export type LocalKOTUncheckedCreateWithoutOrderInput = {
    id?: string
    kotNumber: number
    sentAt?: Date | string
    sentBy: string
    items?: LocalOrderItemUncheckedCreateNestedManyWithoutKotInput
  }

  export type LocalKOTCreateOrConnectWithoutOrderInput = {
    where: LocalKOTWhereUniqueInput
    create: XOR<LocalKOTCreateWithoutOrderInput, LocalKOTUncheckedCreateWithoutOrderInput>
  }

  export type LocalKOTCreateManyOrderInputEnvelope = {
    data: LocalKOTCreateManyOrderInput | LocalKOTCreateManyOrderInput[]
  }

  export type LocalSettlementCreateWithoutOrderInput = {
    id?: string
    subtotal: number
    taxTotal: number
    discountTotal: number
    grandTotal: number
    cashPaid?: number
    cardPaid?: number
    upiPaid?: number
    discountType?: string | null
    discountValue?: number | null
    discountReason?: string | null
    changeGiven?: number
    settledAt?: Date | string
  }

  export type LocalSettlementUncheckedCreateWithoutOrderInput = {
    id?: string
    subtotal: number
    taxTotal: number
    discountTotal: number
    grandTotal: number
    cashPaid?: number
    cardPaid?: number
    upiPaid?: number
    discountType?: string | null
    discountValue?: number | null
    discountReason?: string | null
    changeGiven?: number
    settledAt?: Date | string
  }

  export type LocalSettlementCreateOrConnectWithoutOrderInput = {
    where: LocalSettlementWhereUniqueInput
    create: XOR<LocalSettlementCreateWithoutOrderInput, LocalSettlementUncheckedCreateWithoutOrderInput>
  }

  export type LocalOrderItemUpsertWithWhereUniqueWithoutOrderInput = {
    where: LocalOrderItemWhereUniqueInput
    update: XOR<LocalOrderItemUpdateWithoutOrderInput, LocalOrderItemUncheckedUpdateWithoutOrderInput>
    create: XOR<LocalOrderItemCreateWithoutOrderInput, LocalOrderItemUncheckedCreateWithoutOrderInput>
  }

  export type LocalOrderItemUpdateWithWhereUniqueWithoutOrderInput = {
    where: LocalOrderItemWhereUniqueInput
    data: XOR<LocalOrderItemUpdateWithoutOrderInput, LocalOrderItemUncheckedUpdateWithoutOrderInput>
  }

  export type LocalOrderItemUpdateManyWithWhereWithoutOrderInput = {
    where: LocalOrderItemScalarWhereInput
    data: XOR<LocalOrderItemUpdateManyMutationInput, LocalOrderItemUncheckedUpdateManyWithoutOrderInput>
  }

  export type LocalOrderItemScalarWhereInput = {
    AND?: LocalOrderItemScalarWhereInput | LocalOrderItemScalarWhereInput[]
    OR?: LocalOrderItemScalarWhereInput[]
    NOT?: LocalOrderItemScalarWhereInput | LocalOrderItemScalarWhereInput[]
    id?: StringFilter<"LocalOrderItem"> | string
    orderId?: StringFilter<"LocalOrderItem"> | string
    itemId?: StringFilter<"LocalOrderItem"> | string
    itemName?: StringFilter<"LocalOrderItem"> | string
    variationId?: StringNullableFilter<"LocalOrderItem"> | string | null
    variationName?: StringNullableFilter<"LocalOrderItem"> | string | null
    kotId?: StringNullableFilter<"LocalOrderItem"> | string | null
    quantity?: IntFilter<"LocalOrderItem"> | number
    unitPrice?: FloatFilter<"LocalOrderItem"> | number
    lineTotal?: FloatFilter<"LocalOrderItem"> | number
    status?: StringFilter<"LocalOrderItem"> | string
    note?: StringNullableFilter<"LocalOrderItem"> | string | null
  }

  export type LocalKOTUpsertWithWhereUniqueWithoutOrderInput = {
    where: LocalKOTWhereUniqueInput
    update: XOR<LocalKOTUpdateWithoutOrderInput, LocalKOTUncheckedUpdateWithoutOrderInput>
    create: XOR<LocalKOTCreateWithoutOrderInput, LocalKOTUncheckedCreateWithoutOrderInput>
  }

  export type LocalKOTUpdateWithWhereUniqueWithoutOrderInput = {
    where: LocalKOTWhereUniqueInput
    data: XOR<LocalKOTUpdateWithoutOrderInput, LocalKOTUncheckedUpdateWithoutOrderInput>
  }

  export type LocalKOTUpdateManyWithWhereWithoutOrderInput = {
    where: LocalKOTScalarWhereInput
    data: XOR<LocalKOTUpdateManyMutationInput, LocalKOTUncheckedUpdateManyWithoutOrderInput>
  }

  export type LocalKOTScalarWhereInput = {
    AND?: LocalKOTScalarWhereInput | LocalKOTScalarWhereInput[]
    OR?: LocalKOTScalarWhereInput[]
    NOT?: LocalKOTScalarWhereInput | LocalKOTScalarWhereInput[]
    id?: StringFilter<"LocalKOT"> | string
    orderId?: StringFilter<"LocalKOT"> | string
    kotNumber?: IntFilter<"LocalKOT"> | number
    sentAt?: DateTimeFilter<"LocalKOT"> | Date | string
    sentBy?: StringFilter<"LocalKOT"> | string
  }

  export type LocalSettlementUpsertWithoutOrderInput = {
    update: XOR<LocalSettlementUpdateWithoutOrderInput, LocalSettlementUncheckedUpdateWithoutOrderInput>
    create: XOR<LocalSettlementCreateWithoutOrderInput, LocalSettlementUncheckedCreateWithoutOrderInput>
    where?: LocalSettlementWhereInput
  }

  export type LocalSettlementUpdateToOneWithWhereWithoutOrderInput = {
    where?: LocalSettlementWhereInput
    data: XOR<LocalSettlementUpdateWithoutOrderInput, LocalSettlementUncheckedUpdateWithoutOrderInput>
  }

  export type LocalSettlementUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    cashPaid?: FloatFieldUpdateOperationsInput | number
    cardPaid?: FloatFieldUpdateOperationsInput | number
    upiPaid?: FloatFieldUpdateOperationsInput | number
    discountType?: NullableStringFieldUpdateOperationsInput | string | null
    discountValue?: NullableFloatFieldUpdateOperationsInput | number | null
    discountReason?: NullableStringFieldUpdateOperationsInput | string | null
    changeGiven?: FloatFieldUpdateOperationsInput | number
    settledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalSettlementUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    cashPaid?: FloatFieldUpdateOperationsInput | number
    cardPaid?: FloatFieldUpdateOperationsInput | number
    upiPaid?: FloatFieldUpdateOperationsInput | number
    discountType?: NullableStringFieldUpdateOperationsInput | string | null
    discountValue?: NullableFloatFieldUpdateOperationsInput | number | null
    discountReason?: NullableStringFieldUpdateOperationsInput | string | null
    changeGiven?: FloatFieldUpdateOperationsInput | number
    settledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalOrderCreateWithoutItemsInput = {
    id?: string
    tableId?: string | null
    tableName?: string | null
    customerId?: string | null
    customerPhone?: string | null
    guestCount?: number
    status?: string
    syncStatus?: string
    subtotal?: number
    taxTotal?: number
    discountTotal?: number
    grandTotal?: number
    orderType?: string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kots?: LocalKOTCreateNestedManyWithoutOrderInput
    settlement?: LocalSettlementCreateNestedOneWithoutOrderInput
  }

  export type LocalOrderUncheckedCreateWithoutItemsInput = {
    id?: string
    tableId?: string | null
    tableName?: string | null
    customerId?: string | null
    customerPhone?: string | null
    guestCount?: number
    status?: string
    syncStatus?: string
    subtotal?: number
    taxTotal?: number
    discountTotal?: number
    grandTotal?: number
    orderType?: string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kots?: LocalKOTUncheckedCreateNestedManyWithoutOrderInput
    settlement?: LocalSettlementUncheckedCreateNestedOneWithoutOrderInput
  }

  export type LocalOrderCreateOrConnectWithoutItemsInput = {
    where: LocalOrderWhereUniqueInput
    create: XOR<LocalOrderCreateWithoutItemsInput, LocalOrderUncheckedCreateWithoutItemsInput>
  }

  export type LocalKOTCreateWithoutItemsInput = {
    id?: string
    kotNumber: number
    sentAt?: Date | string
    sentBy: string
    order: LocalOrderCreateNestedOneWithoutKotsInput
  }

  export type LocalKOTUncheckedCreateWithoutItemsInput = {
    id?: string
    orderId: string
    kotNumber: number
    sentAt?: Date | string
    sentBy: string
  }

  export type LocalKOTCreateOrConnectWithoutItemsInput = {
    where: LocalKOTWhereUniqueInput
    create: XOR<LocalKOTCreateWithoutItemsInput, LocalKOTUncheckedCreateWithoutItemsInput>
  }

  export type LocalOrderUpsertWithoutItemsInput = {
    update: XOR<LocalOrderUpdateWithoutItemsInput, LocalOrderUncheckedUpdateWithoutItemsInput>
    create: XOR<LocalOrderCreateWithoutItemsInput, LocalOrderUncheckedCreateWithoutItemsInput>
    where?: LocalOrderWhereInput
  }

  export type LocalOrderUpdateToOneWithWhereWithoutItemsInput = {
    where?: LocalOrderWhereInput
    data: XOR<LocalOrderUpdateWithoutItemsInput, LocalOrderUncheckedUpdateWithoutItemsInput>
  }

  export type LocalOrderUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    syncStatus?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    orderType?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kots?: LocalKOTUpdateManyWithoutOrderNestedInput
    settlement?: LocalSettlementUpdateOneWithoutOrderNestedInput
  }

  export type LocalOrderUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    syncStatus?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    orderType?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kots?: LocalKOTUncheckedUpdateManyWithoutOrderNestedInput
    settlement?: LocalSettlementUncheckedUpdateOneWithoutOrderNestedInput
  }

  export type LocalKOTUpsertWithoutItemsInput = {
    update: XOR<LocalKOTUpdateWithoutItemsInput, LocalKOTUncheckedUpdateWithoutItemsInput>
    create: XOR<LocalKOTCreateWithoutItemsInput, LocalKOTUncheckedCreateWithoutItemsInput>
    where?: LocalKOTWhereInput
  }

  export type LocalKOTUpdateToOneWithWhereWithoutItemsInput = {
    where?: LocalKOTWhereInput
    data: XOR<LocalKOTUpdateWithoutItemsInput, LocalKOTUncheckedUpdateWithoutItemsInput>
  }

  export type LocalKOTUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    kotNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentBy?: StringFieldUpdateOperationsInput | string
    order?: LocalOrderUpdateOneRequiredWithoutKotsNestedInput
  }

  export type LocalKOTUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    kotNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentBy?: StringFieldUpdateOperationsInput | string
  }

  export type LocalOrderCreateWithoutKotsInput = {
    id?: string
    tableId?: string | null
    tableName?: string | null
    customerId?: string | null
    customerPhone?: string | null
    guestCount?: number
    status?: string
    syncStatus?: string
    subtotal?: number
    taxTotal?: number
    discountTotal?: number
    grandTotal?: number
    orderType?: string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: LocalOrderItemCreateNestedManyWithoutOrderInput
    settlement?: LocalSettlementCreateNestedOneWithoutOrderInput
  }

  export type LocalOrderUncheckedCreateWithoutKotsInput = {
    id?: string
    tableId?: string | null
    tableName?: string | null
    customerId?: string | null
    customerPhone?: string | null
    guestCount?: number
    status?: string
    syncStatus?: string
    subtotal?: number
    taxTotal?: number
    discountTotal?: number
    grandTotal?: number
    orderType?: string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: LocalOrderItemUncheckedCreateNestedManyWithoutOrderInput
    settlement?: LocalSettlementUncheckedCreateNestedOneWithoutOrderInput
  }

  export type LocalOrderCreateOrConnectWithoutKotsInput = {
    where: LocalOrderWhereUniqueInput
    create: XOR<LocalOrderCreateWithoutKotsInput, LocalOrderUncheckedCreateWithoutKotsInput>
  }

  export type LocalOrderItemCreateWithoutKotInput = {
    id?: string
    itemId: string
    itemName: string
    variationId?: string | null
    variationName?: string | null
    quantity?: number
    unitPrice: number
    lineTotal: number
    status?: string
    note?: string | null
    order: LocalOrderCreateNestedOneWithoutItemsInput
  }

  export type LocalOrderItemUncheckedCreateWithoutKotInput = {
    id?: string
    orderId: string
    itemId: string
    itemName: string
    variationId?: string | null
    variationName?: string | null
    quantity?: number
    unitPrice: number
    lineTotal: number
    status?: string
    note?: string | null
  }

  export type LocalOrderItemCreateOrConnectWithoutKotInput = {
    where: LocalOrderItemWhereUniqueInput
    create: XOR<LocalOrderItemCreateWithoutKotInput, LocalOrderItemUncheckedCreateWithoutKotInput>
  }

  export type LocalOrderItemCreateManyKotInputEnvelope = {
    data: LocalOrderItemCreateManyKotInput | LocalOrderItemCreateManyKotInput[]
  }

  export type LocalOrderUpsertWithoutKotsInput = {
    update: XOR<LocalOrderUpdateWithoutKotsInput, LocalOrderUncheckedUpdateWithoutKotsInput>
    create: XOR<LocalOrderCreateWithoutKotsInput, LocalOrderUncheckedCreateWithoutKotsInput>
    where?: LocalOrderWhereInput
  }

  export type LocalOrderUpdateToOneWithWhereWithoutKotsInput = {
    where?: LocalOrderWhereInput
    data: XOR<LocalOrderUpdateWithoutKotsInput, LocalOrderUncheckedUpdateWithoutKotsInput>
  }

  export type LocalOrderUpdateWithoutKotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    syncStatus?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    orderType?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: LocalOrderItemUpdateManyWithoutOrderNestedInput
    settlement?: LocalSettlementUpdateOneWithoutOrderNestedInput
  }

  export type LocalOrderUncheckedUpdateWithoutKotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    syncStatus?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    orderType?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: LocalOrderItemUncheckedUpdateManyWithoutOrderNestedInput
    settlement?: LocalSettlementUncheckedUpdateOneWithoutOrderNestedInput
  }

  export type LocalOrderItemUpsertWithWhereUniqueWithoutKotInput = {
    where: LocalOrderItemWhereUniqueInput
    update: XOR<LocalOrderItemUpdateWithoutKotInput, LocalOrderItemUncheckedUpdateWithoutKotInput>
    create: XOR<LocalOrderItemCreateWithoutKotInput, LocalOrderItemUncheckedCreateWithoutKotInput>
  }

  export type LocalOrderItemUpdateWithWhereUniqueWithoutKotInput = {
    where: LocalOrderItemWhereUniqueInput
    data: XOR<LocalOrderItemUpdateWithoutKotInput, LocalOrderItemUncheckedUpdateWithoutKotInput>
  }

  export type LocalOrderItemUpdateManyWithWhereWithoutKotInput = {
    where: LocalOrderItemScalarWhereInput
    data: XOR<LocalOrderItemUpdateManyMutationInput, LocalOrderItemUncheckedUpdateManyWithoutKotInput>
  }

  export type LocalOrderCreateWithoutSettlementInput = {
    id?: string
    tableId?: string | null
    tableName?: string | null
    customerId?: string | null
    customerPhone?: string | null
    guestCount?: number
    status?: string
    syncStatus?: string
    subtotal?: number
    taxTotal?: number
    discountTotal?: number
    grandTotal?: number
    orderType?: string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: LocalOrderItemCreateNestedManyWithoutOrderInput
    kots?: LocalKOTCreateNestedManyWithoutOrderInput
  }

  export type LocalOrderUncheckedCreateWithoutSettlementInput = {
    id?: string
    tableId?: string | null
    tableName?: string | null
    customerId?: string | null
    customerPhone?: string | null
    guestCount?: number
    status?: string
    syncStatus?: string
    subtotal?: number
    taxTotal?: number
    discountTotal?: number
    grandTotal?: number
    orderType?: string
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: LocalOrderItemUncheckedCreateNestedManyWithoutOrderInput
    kots?: LocalKOTUncheckedCreateNestedManyWithoutOrderInput
  }

  export type LocalOrderCreateOrConnectWithoutSettlementInput = {
    where: LocalOrderWhereUniqueInput
    create: XOR<LocalOrderCreateWithoutSettlementInput, LocalOrderUncheckedCreateWithoutSettlementInput>
  }

  export type LocalOrderUpsertWithoutSettlementInput = {
    update: XOR<LocalOrderUpdateWithoutSettlementInput, LocalOrderUncheckedUpdateWithoutSettlementInput>
    create: XOR<LocalOrderCreateWithoutSettlementInput, LocalOrderUncheckedCreateWithoutSettlementInput>
    where?: LocalOrderWhereInput
  }

  export type LocalOrderUpdateToOneWithWhereWithoutSettlementInput = {
    where?: LocalOrderWhereInput
    data: XOR<LocalOrderUpdateWithoutSettlementInput, LocalOrderUncheckedUpdateWithoutSettlementInput>
  }

  export type LocalOrderUpdateWithoutSettlementInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    syncStatus?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    orderType?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: LocalOrderItemUpdateManyWithoutOrderNestedInput
    kots?: LocalKOTUpdateManyWithoutOrderNestedInput
  }

  export type LocalOrderUncheckedUpdateWithoutSettlementInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    syncStatus?: StringFieldUpdateOperationsInput | string
    subtotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    discountTotal?: FloatFieldUpdateOperationsInput | number
    grandTotal?: FloatFieldUpdateOperationsInput | number
    orderType?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: LocalOrderItemUncheckedUpdateManyWithoutOrderNestedInput
    kots?: LocalKOTUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type PrintHistoryCreateWithoutPrinterInput = {
    id?: string
    printType: string
    orderId?: string | null
    tableName?: string | null
    status?: string
    retryCount?: number
    error?: string | null
    createdAt?: Date | string
  }

  export type PrintHistoryUncheckedCreateWithoutPrinterInput = {
    id?: string
    printType: string
    orderId?: string | null
    tableName?: string | null
    status?: string
    retryCount?: number
    error?: string | null
    createdAt?: Date | string
  }

  export type PrintHistoryCreateOrConnectWithoutPrinterInput = {
    where: PrintHistoryWhereUniqueInput
    create: XOR<PrintHistoryCreateWithoutPrinterInput, PrintHistoryUncheckedCreateWithoutPrinterInput>
  }

  export type PrintHistoryCreateManyPrinterInputEnvelope = {
    data: PrintHistoryCreateManyPrinterInput | PrintHistoryCreateManyPrinterInput[]
  }

  export type PrintHistoryUpsertWithWhereUniqueWithoutPrinterInput = {
    where: PrintHistoryWhereUniqueInput
    update: XOR<PrintHistoryUpdateWithoutPrinterInput, PrintHistoryUncheckedUpdateWithoutPrinterInput>
    create: XOR<PrintHistoryCreateWithoutPrinterInput, PrintHistoryUncheckedCreateWithoutPrinterInput>
  }

  export type PrintHistoryUpdateWithWhereUniqueWithoutPrinterInput = {
    where: PrintHistoryWhereUniqueInput
    data: XOR<PrintHistoryUpdateWithoutPrinterInput, PrintHistoryUncheckedUpdateWithoutPrinterInput>
  }

  export type PrintHistoryUpdateManyWithWhereWithoutPrinterInput = {
    where: PrintHistoryScalarWhereInput
    data: XOR<PrintHistoryUpdateManyMutationInput, PrintHistoryUncheckedUpdateManyWithoutPrinterInput>
  }

  export type PrintHistoryScalarWhereInput = {
    AND?: PrintHistoryScalarWhereInput | PrintHistoryScalarWhereInput[]
    OR?: PrintHistoryScalarWhereInput[]
    NOT?: PrintHistoryScalarWhereInput | PrintHistoryScalarWhereInput[]
    id?: StringFilter<"PrintHistory"> | string
    printerId?: StringFilter<"PrintHistory"> | string
    printType?: StringFilter<"PrintHistory"> | string
    orderId?: StringNullableFilter<"PrintHistory"> | string | null
    tableName?: StringNullableFilter<"PrintHistory"> | string | null
    status?: StringFilter<"PrintHistory"> | string
    retryCount?: IntFilter<"PrintHistory"> | number
    error?: StringNullableFilter<"PrintHistory"> | string | null
    createdAt?: DateTimeFilter<"PrintHistory"> | Date | string
  }

  export type PrinterConfigCreateWithoutPrintHistoryInput = {
    id?: string
    name: string
    displayName: string
    type: string
    connection: string
    address?: string | null
    vendorId?: number | null
    productId?: number | null
    paperWidth?: number
    isDefault?: boolean
    isActive?: boolean
    isKitchen?: boolean
    isBilling?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrinterConfigUncheckedCreateWithoutPrintHistoryInput = {
    id?: string
    name: string
    displayName: string
    type: string
    connection: string
    address?: string | null
    vendorId?: number | null
    productId?: number | null
    paperWidth?: number
    isDefault?: boolean
    isActive?: boolean
    isKitchen?: boolean
    isBilling?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrinterConfigCreateOrConnectWithoutPrintHistoryInput = {
    where: PrinterConfigWhereUniqueInput
    create: XOR<PrinterConfigCreateWithoutPrintHistoryInput, PrinterConfigUncheckedCreateWithoutPrintHistoryInput>
  }

  export type PrinterConfigUpsertWithoutPrintHistoryInput = {
    update: XOR<PrinterConfigUpdateWithoutPrintHistoryInput, PrinterConfigUncheckedUpdateWithoutPrintHistoryInput>
    create: XOR<PrinterConfigCreateWithoutPrintHistoryInput, PrinterConfigUncheckedCreateWithoutPrintHistoryInput>
    where?: PrinterConfigWhereInput
  }

  export type PrinterConfigUpdateToOneWithWhereWithoutPrintHistoryInput = {
    where?: PrinterConfigWhereInput
    data: XOR<PrinterConfigUpdateWithoutPrintHistoryInput, PrinterConfigUncheckedUpdateWithoutPrintHistoryInput>
  }

  export type PrinterConfigUpdateWithoutPrintHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    connection?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productId?: NullableIntFieldUpdateOperationsInput | number | null
    paperWidth?: IntFieldUpdateOperationsInput | number
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isKitchen?: BoolFieldUpdateOperationsInput | boolean
    isBilling?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrinterConfigUncheckedUpdateWithoutPrintHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    connection?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productId?: NullableIntFieldUpdateOperationsInput | number | null
    paperWidth?: IntFieldUpdateOperationsInput | number
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isKitchen?: BoolFieldUpdateOperationsInput | boolean
    isBilling?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocalOrderItemCreateManyOrderInput = {
    id?: string
    itemId: string
    itemName: string
    variationId?: string | null
    variationName?: string | null
    kotId?: string | null
    quantity?: number
    unitPrice: number
    lineTotal: number
    status?: string
    note?: string | null
  }

  export type LocalKOTCreateManyOrderInput = {
    id?: string
    kotNumber: number
    sentAt?: Date | string
    sentBy: string
  }

  export type LocalOrderItemUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    variationId?: NullableStringFieldUpdateOperationsInput | string | null
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    kot?: LocalKOTUpdateOneWithoutItemsNestedInput
  }

  export type LocalOrderItemUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    variationId?: NullableStringFieldUpdateOperationsInput | string | null
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    kotId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocalOrderItemUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    variationId?: NullableStringFieldUpdateOperationsInput | string | null
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    kotId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocalKOTUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    kotNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentBy?: StringFieldUpdateOperationsInput | string
    items?: LocalOrderItemUpdateManyWithoutKotNestedInput
  }

  export type LocalKOTUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    kotNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentBy?: StringFieldUpdateOperationsInput | string
    items?: LocalOrderItemUncheckedUpdateManyWithoutKotNestedInput
  }

  export type LocalKOTUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    kotNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentBy?: StringFieldUpdateOperationsInput | string
  }

  export type LocalOrderItemCreateManyKotInput = {
    id?: string
    orderId: string
    itemId: string
    itemName: string
    variationId?: string | null
    variationName?: string | null
    quantity?: number
    unitPrice: number
    lineTotal: number
    status?: string
    note?: string | null
  }

  export type LocalOrderItemUpdateWithoutKotInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    variationId?: NullableStringFieldUpdateOperationsInput | string | null
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    order?: LocalOrderUpdateOneRequiredWithoutItemsNestedInput
  }

  export type LocalOrderItemUncheckedUpdateWithoutKotInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    variationId?: NullableStringFieldUpdateOperationsInput | string | null
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocalOrderItemUncheckedUpdateManyWithoutKotInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    variationId?: NullableStringFieldUpdateOperationsInput | string | null
    variationName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PrintHistoryCreateManyPrinterInput = {
    id?: string
    printType: string
    orderId?: string | null
    tableName?: string | null
    status?: string
    retryCount?: number
    error?: string | null
    createdAt?: Date | string
  }

  export type PrintHistoryUpdateWithoutPrinterInput = {
    id?: StringFieldUpdateOperationsInput | string
    printType?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrintHistoryUncheckedUpdateWithoutPrinterInput = {
    id?: StringFieldUpdateOperationsInput | string
    printType?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrintHistoryUncheckedUpdateManyWithoutPrinterInput = {
    id?: StringFieldUpdateOperationsInput | string
    printType?: StringFieldUpdateOperationsInput | string
    orderId?: NullableStringFieldUpdateOperationsInput | string | null
    tableName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    retryCount?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}