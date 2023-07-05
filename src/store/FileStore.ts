import {observable, action, makeObservable, computed, toJS} from 'mobx';
import {RootStore as RootStoreModel} from './rootStore';
import {NodeModel} from '@minoru/react-dnd-treeview';


export class FileStore {
    currentFile: NodeModel | null = null;
    rootDirectory = '';
    files?: NodeModel[] | null = [
        {
            "id": 2,
            "parent": 1,
            "text": "README.md",
            "droppable": false,
            "data": {
                "type": "file",
                "value": "# 1\n\n## Project structure\n\n-   `contracts` - source code of all the smart contracts of the project and their dependencies.\n-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.\n-   `tests` - tests for the contracts.\n-   `scripts` - scripts used by the project, mainly the deployment scripts.\n\n## How to use\n\n### Build\n\n`npx blueprint build` or `yarn blueprint build`\n\n### Test\n\n`npx blueprint test` or `yarn blueprint test`\n\n### Deploy or run another script\n\n`npx blueprint run` or `yarn blueprint run`\n\n### Add a new contract\n\n`npx blueprint create ContractName` or `yarn blueprint create ContractName`\n\n# License\nMIT\n"
            }
        },
        {
            "id": 5,
            "parent": 4,
            "text": "stdlib.fc",
            "droppable": false,
            "data": {
                "type": "file",
                "value": ";; Standard library for funC\n;;\n\n{-\n  # Tuple manipulation primitives\n  The names and the types are mostly self-explaining.\n  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)\n  for more info on the polymorphic functions.\n\n  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)\n  and vise versa.\n-}\n\n{-\n  # Lisp-style lists\n\n  Lists can be represented as nested 2-elements tuples.\n  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).\n  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.\n-}\n\n;;; Adds an element to the beginning of lisp-style list.\nforall X -> tuple cons(X head, tuple tail) asm \"CONS\";\n\n;;; Extracts the head and the tail of lisp-style list.\nforall X -> (X, tuple) uncons(tuple list) asm \"UNCONS\";\n\n;;; Extracts the tail and the head of lisp-style list.\nforall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) \"UNCONS\";\n\n;;; Returns the head of lisp-style list.\nforall X -> X car(tuple list) asm \"CAR\";\n\n;;; Returns the tail of lisp-style list.\ntuple cdr(tuple list) asm \"CDR\";\n\n;;; Creates tuple with zero elements.\ntuple empty_tuple() asm \"NIL\";\n\n;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`\n;;; is of length at most 255. Otherwise throws a type check exception.\nforall X -> tuple tpush(tuple t, X value) asm \"TPUSH\";\nforall X -> (tuple, ()) ~tpush(tuple t, X value) asm \"TPUSH\";\n\n;;; Creates a tuple of length one with given argument as element.\nforall X -> [X] single(X x) asm \"SINGLE\";\n\n;;; Unpacks a tuple of length one\nforall X -> X unsingle([X] t) asm \"UNSINGLE\";\n\n;;; Creates a tuple of length two with given arguments as elements.\nforall X, Y -> [X, Y] pair(X x, Y y) asm \"PAIR\";\n\n;;; Unpacks a tuple of length two\nforall X, Y -> (X, Y) unpair([X, Y] t) asm \"UNPAIR\";\n\n;;; Creates a tuple of length three with given arguments as elements.\nforall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm \"TRIPLE\";\n\n;;; Unpacks a tuple of length three\nforall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm \"UNTRIPLE\";\n\n;;; Creates a tuple of length four with given arguments as elements.\nforall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm \"4 TUPLE\";\n\n;;; Unpacks a tuple of length four\nforall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm \"4 UNTUPLE\";\n\n;;; Returns the first element of a tuple (with unknown element types).\nforall X -> X first(tuple t) asm \"FIRST\";\n\n;;; Returns the second element of a tuple (with unknown element types).\nforall X -> X second(tuple t) asm \"SECOND\";\n\n;;; Returns the third element of a tuple (with unknown element types).\nforall X -> X third(tuple t) asm \"THIRD\";\n\n;;; Returns the fourth element of a tuple (with unknown element types).\nforall X -> X fourth(tuple t) asm \"3 INDEX\";\n\n;;; Returns the first element of a pair tuple.\nforall X, Y -> X pair_first([X, Y] p) asm \"FIRST\";\n\n;;; Returns the second element of a pair tuple.\nforall X, Y -> Y pair_second([X, Y] p) asm \"SECOND\";\n\n;;; Returns the first element of a triple tuple.\nforall X, Y, Z -> X triple_first([X, Y, Z] p) asm \"FIRST\";\n\n;;; Returns the second element of a triple tuple.\nforall X, Y, Z -> Y triple_second([X, Y, Z] p) asm \"SECOND\";\n\n;;; Returns the third element of a triple tuple.\nforall X, Y, Z -> Z triple_third([X, Y, Z] p) asm \"THIRD\";\n\n\n;;; Push null element (casted to given type)\n;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.\n;;; So `null` can actually have any atomic type.\nforall X -> X null() asm \"PUSHNULL\";\n\n;;; Moves a variable [x] to the top of the stack\nforall X -> (X, ()) ~impure_touch(X x) impure asm \"NOP\";\n\n\n\n;;; Returns the current Unix time as an Integer\nint now() asm \"NOW\";\n\n;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.\n;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].\nslice my_address() asm \"MYADDR\";\n\n;;; Returns the balance of the smart contract as a tuple consisting of an int\n;;; (balance in nanotoncoins) and a `cell`\n;;; (a dictionary with 32-bit keys representing the balance of \"extra currencies\")\n;;; at the start of Computation Phase.\n;;; Note that RAW primitives such as [send_raw_message] do not update this field.\n[int, cell] get_balance() asm \"BALANCE\";\n\n;;; Returns the logical time of the current transaction.\nint cur_lt() asm \"LTIME\";\n\n;;; Returns the starting logical time of the current block.\nint block_lt() asm \"BLOCKLT\";\n\n;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.\n;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.\nint cell_hash(cell c) asm \"HASHCU\";\n\n;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.\n;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created\n;;; and its hash computed by [cell_hash].\nint slice_hash(slice s) asm \"HASHSU\";\n\n;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,\n;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.\nint string_hash(slice s) asm \"SHA256U\";\n\n{-\n  # Signature checks\n-}\n\n;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)\n;;; using [public_key] (also represented by a 256-bit unsigned integer).\n;;; The signature must contain at least 512 data bits; only the first 512 bits are used.\n;;; The result is `−1` if the signature is valid, `0` otherwise.\n;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.\n;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,\n;;; the second hashing occurring inside `CHKSIGNS`.\nint check_signature(int hash, slice signature, int public_key) asm \"CHKSIGNU\";\n\n;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,\n;;; similarly to [check_signature].\n;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.\n;;; The verification of Ed25519 signatures is the standard one,\n;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.\nint check_data_signature(slice data, slice signature, int public_key) asm \"CHKSIGNS\";\n\n{---\n  # Computation of boc size\n  The primitives below may be useful for computing storage fees of user-provided data.\n-}\n\n;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.\n;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`\n;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account\n;;; the identification of equal cells.\n;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,\n;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.\n;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];\n;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and\n;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.\n(int, int, int) compute_data_size(cell c, int max_cells) impure asm \"CDATASIZE\";\n\n;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.\n;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;\n;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.\n(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm \"SDATASIZE\";\n\n;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.\n(int, int, int, int) compute_data_size?(cell c, int max_cells) asm \"CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT\";\n\n;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.\n(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm \"SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT\";\n\n;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)\n;; () throw_if(int excno, int cond) impure asm \"THROWARGIF\";\n\n{--\n  # Debug primitives\n  Only works for local TVM execution with debug level verbosity\n-}\n;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.\n() dump_stack() impure asm \"DUMPSTK\";\n\n{-\n  # Persistent storage save and load\n-}\n\n;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.\ncell get_data() asm \"c4 PUSH\";\n\n;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.\n() set_data(cell c) impure asm \"c4 POP\";\n\n{-\n  # Continuation primitives\n-}\n;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.\n;;; The primitive returns the current value of `c3`.\ncont get_c3() impure asm \"c3 PUSH\";\n\n;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.\n;;; Note that after execution of this primitive the current code\n;;; (and the stack of recursive function calls) won't change,\n;;; but any other function call will use a function from the new code.\n() set_c3(cont c) impure asm \"c3 POP\";\n\n;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.\ncont bless(slice s) impure asm \"BLESS\";\n\n{---\n  # Gas related primitives\n-}\n\n;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,\n;;; decreasing the value of `gr` by `gc` in the process.\n;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.\n;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.\n;;;\n;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).\n() accept_message() impure asm \"ACCEPT\";\n\n;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.\n;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,\n;;; an (unhandled) out of gas exception is thrown before setting new gas limits.\n;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].\n() set_gas_limit(int limit) impure asm \"SETGASLIMIT\";\n\n;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)\n;;; so that the current execution is considered “successful” with the saved values even if an exception\n;;; in Computation Phase is thrown later.\n() commit() impure asm \"COMMIT\";\n\n;;; Not implemented\n;;() buy_gas(int gram) impure asm \"BUYGAS\";\n\n;;; Computes the amount of gas that can be bought for `amount` nanoTONs,\n;;; and sets `gl` accordingly in the same way as [set_gas_limit].\n() buy_gas(int amount) impure asm \"BUYGAS\";\n\n;;; Computes the minimum of two integers [x] and [y].\nint min(int x, int y) asm \"MIN\";\n\n;;; Computes the maximum of two integers [x] and [y].\nint max(int x, int y) asm \"MAX\";\n\n;;; Sorts two integers.\n(int, int) minmax(int x, int y) asm \"MINMAX\";\n\n;;; Computes the absolute value of an integer [x].\nint abs(int x) asm \"ABS\";\n\n{-\n  # Slice primitives\n\n  It is said that a primitive _loads_ some data,\n  if it returns the data and the remainder of the slice\n  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).\n\n  It is said that a primitive _preloads_ some data, if it returns only the data\n  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).\n\n  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.\n-}\n\n\n;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,\n;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)\n;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.\nslice begin_parse(cell c) asm \"CTOS\";\n\n;;; Checks if [s] is empty. If not, throws an exception.\n() end_parse(slice s) impure asm \"ENDS\";\n\n;;; Loads the first reference from the slice.\n(slice, cell) load_ref(slice s) asm( -> 1 0) \"LDREF\";\n\n;;; Preloads the first reference from the slice.\ncell preload_ref(slice s) asm \"PLDREF\";\n\n  {- Functions below are commented because are implemented on compilator level for optimisation -}\n\n;;; Loads a signed [len]-bit integer from a slice [s].\n;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) \"LDIX\";\n\n;;; Loads an unsigned [len]-bit integer from a slice [s].\n;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) \"LDUX\";\n\n;;; Preloads a signed [len]-bit integer from a slice [s].\n;; int preload_int(slice s, int len) asm \"PLDIX\";\n\n;;; Preloads an unsigned [len]-bit integer from a slice [s].\n;; int preload_uint(slice s, int len) asm \"PLDUX\";\n\n;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.\n;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) \"LDSLICEX\";\n\n;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.\n;; slice preload_bits(slice s, int len) asm \"PLDSLICEX\";\n\n;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).\n(slice, int) load_grams(slice s) asm( -> 1 0) \"LDGRAMS\";\n(slice, int) load_coins(slice s) asm( -> 1 0) \"LDGRAMS\";\n\n;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].\nslice skip_bits(slice s, int len) asm \"SDSKIPFIRST\";\n(slice, ()) ~skip_bits(slice s, int len) asm \"SDSKIPFIRST\";\n\n;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].\nslice first_bits(slice s, int len) asm \"SDCUTFIRST\";\n\n;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].\nslice skip_last_bits(slice s, int len) asm \"SDSKIPLAST\";\n(slice, ()) ~skip_last_bits(slice s, int len) asm \"SDSKIPLAST\";\n\n;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].\nslice slice_last(slice s, int len) asm \"SDCUTLAST\";\n\n;;; Loads a dictionary `D` (HashMapE) from `slice` [s].\n;;; (returns `null` if `nothing` constructor is used).\n(slice, cell) load_dict(slice s) asm( -> 1 0) \"LDDICT\";\n\n;;; Preloads a dictionary `D` from `slice` [s].\ncell preload_dict(slice s) asm \"PLDDICT\";\n\n;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.\nslice skip_dict(slice s) asm \"SKIPDICT\";\n\n;;; Loads (Maybe ^Cell) from `slice` [s].\n;;; In other words loads 1 bit and if it is true\n;;; loads first ref and return it with slice remainder\n;;; otherwise returns `null` and slice remainder\n(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) \"LDOPTREF\";\n\n;;; Preloads (Maybe ^Cell) from `slice` [s].\ncell preload_maybe_ref(slice s) asm \"PLDOPTREF\";\n\n\n;;; Returns the depth of `cell` [c].\n;;; If [c] has no references, then return `0`;\n;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].\n;;; If [c] is a `null` instead of a cell, returns zero.\nint cell_depth(cell c) asm \"CDEPTH\";\n\n\n{-\n  # Slice size primitives\n-}\n\n;;; Returns the number of references in `slice` [s].\nint slice_refs(slice s) asm \"SREFS\";\n\n;;; Returns the number of data bits in `slice` [s].\nint slice_bits(slice s) asm \"SBITS\";\n\n;;; Returns both the number of data bits and the number of references in `slice` [s].\n(int, int) slice_bits_refs(slice s) asm \"SBITREFS\";\n\n;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).\nint slice_empty?(slice s) asm \"SEMPTY\";\n\n;;; Checks whether `slice` [s] has no bits of data.\nint slice_data_empty?(slice s) asm \"SDEMPTY\";\n\n;;; Checks whether `slice` [s] has no references.\nint slice_refs_empty?(slice s) asm \"SREMPTY\";\n\n;;; Returns the depth of `slice` [s].\n;;; If [s] has no references, then returns `0`;\n;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].\nint slice_depth(slice s) asm \"SDEPTH\";\n\n{-\n  # Builder size primitives\n-}\n\n;;; Returns the number of cell references already stored in `builder` [b]\nint builder_refs(builder b) asm \"BREFS\";\n\n;;; Returns the number of data bits already stored in `builder` [b].\nint builder_bits(builder b) asm \"BBITS\";\n\n;;; Returns the depth of `builder` [b].\n;;; If no cell references are stored in [b], then returns 0;\n;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].\nint builder_depth(builder b) asm \"BDEPTH\";\n\n{-\n  # Builder primitives\n  It is said that a primitive _stores_ a value `x` into a builder `b`\n  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.\n  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).\n\n  All the primitives below first check whether there is enough space in the `builder`,\n  and only then check the range of the value being serialized.\n-}\n\n;;; Creates a new empty `builder`.\nbuilder begin_cell() asm \"NEWC\";\n\n;;; Converts a `builder` into an ordinary `cell`.\ncell end_cell(builder b) asm \"ENDC\";\n\n;;; Stores a reference to `cell` [c] into `builder` [b].\nbuilder store_ref(builder b, cell c) asm(c b) \"STREF\";\n\n;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.\n;; builder store_uint(builder b, int x, int len) asm(x b len) \"STUX\";\n\n;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.\n;; builder store_int(builder b, int x, int len) asm(x b len) \"STIX\";\n\n\n;;; Stores `slice` [s] into `builder` [b]\nbuilder store_slice(builder b, slice s) asm \"STSLICER\";\n\n;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].\n;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,\n;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,\n;;; followed by an `8l`-bit unsigned big-endian representation of [x].\n;;; If [x] does not belong to the supported range, a range check exception is thrown.\n;;;\n;;; Store amounts of TonCoins to the builder as VarUInteger 16\nbuilder store_grams(builder b, int x) asm \"STGRAMS\";\nbuilder store_coins(builder b, int x) asm \"STGRAMS\";\n\n;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].\n;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.\nbuilder store_dict(builder b, cell c) asm(c b) \"STDICT\";\n\n;;; Stores (Maybe ^Cell) to builder:\n;;; if cell is null store 1 zero bit\n;;; otherwise store 1 true bit and ref to cell\nbuilder store_maybe_ref(builder b, cell c) asm(c b) \"STOPTREF\";\n\n\n{-\n  # Address manipulation primitives\n  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:\n  ```TL-B\n  addr_none$00 = MsgAddressExt;\n  addr_extern$01 len:(## 8) external_address:(bits len)\n               = MsgAddressExt;\n  anycast_info$_ depth:(#<= 30) { depth >= 1 }\n    rewrite_pfx:(bits depth) = Anycast;\n  addr_std$10 anycast:(Maybe Anycast)\n    workchain_id:int8 address:bits256 = MsgAddressInt;\n  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)\n    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;\n  _ _:MsgAddressInt = MsgAddress;\n  _ _:MsgAddressExt = MsgAddress;\n\n  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool\n    src:MsgAddress dest:MsgAddressInt\n    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams\n    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;\n  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt\n    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;\n  ```\n  A deserialized `MsgAddress` is represented by a tuple `t` as follows:\n\n  - `addr_none` is represented by `t = (0)`,\n    i.e., a tuple containing exactly one integer equal to zero.\n  - `addr_extern` is represented by `t = (1, s)`,\n    where slice `s` contains the field `external_address`. In other words, `\n    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.\n  - `addr_std` is represented by `t = (2, u, x, s)`,\n    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).\n    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.\n  - `addr_var` is represented by `t = (3, u, x, s)`,\n    where `u`, `x`, and `s` have the same meaning as for `addr_std`.\n-}\n\n;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,\n;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.\n(slice, slice) load_msg_addr(slice s) asm( -> 1 0) \"LDMSGADDR\";\n\n;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.\n;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.\ntuple parse_addr(slice s) asm \"PARSEMSGADDR\";\n\n;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),\n;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,\n;;; and returns both the workchain and the 256-bit address as integers.\n;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,\n;;; throws a cell deserialization exception.\n(int, int) parse_std_addr(slice s) asm \"REWRITESTDADDR\";\n\n;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],\n;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).\n(int, slice) parse_var_addr(slice s) asm \"REWRITEVARADDR\";\n\n{-\n  # Dictionary primitives\n-}\n\n\n;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),\n;;; and returns the resulting dictionary.\ncell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) \"DICTISETREF\";\n(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) \"DICTISETREF\";\n\n;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),\n;;; and returns the resulting dictionary.\ncell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) \"DICTUSETREF\";\n(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) \"DICTUSETREF\";\n\ncell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) \"DICTIGETOPTREF\";\n(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) \"DICTIGETREF\" \"NULLSWAPIFNOT\";\n(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) \"DICTUGETREF\" \"NULLSWAPIFNOT\";\n(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) \"DICTISETGETOPTREF\";\n(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) \"DICTUSETGETOPTREF\";\n(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) \"DICTIDEL\";\n(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) \"DICTUDEL\";\n(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) \"DICTIGET\" \"NULLSWAPIFNOT\";\n(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) \"DICTUGET\" \"NULLSWAPIFNOT\";\n(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) \"DICTIDELGET\" \"NULLSWAPIFNOT\";\n(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) \"DICTUDELGET\" \"NULLSWAPIFNOT\";\n(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) \"DICTIDELGET\" \"NULLSWAPIFNOT\";\n(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) \"DICTUDELGET\" \"NULLSWAPIFNOT\";\ncell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) \"DICTUSET\";\n(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) \"DICTUSET\";\ncell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) \"DICTISET\";\n(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) \"DICTISET\";\ncell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) \"DICTSET\";\n(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) \"DICTSET\";\n(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) \"DICTUADD\";\n(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) \"DICTUREPLACE\";\n(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) \"DICTIADD\";\n(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) \"DICTIREPLACE\";\ncell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) \"DICTUSETB\";\n(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) \"DICTUSETB\";\ncell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) \"DICTISETB\";\n(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) \"DICTISETB\";\ncell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) \"DICTSETB\";\n(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) \"DICTSETB\";\n(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) \"DICTUADDB\";\n(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) \"DICTUREPLACEB\";\n(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) \"DICTIADDB\";\n(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) \"DICTIREPLACEB\";\n(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTUREMMIN\" \"NULLSWAPIFNOT2\";\n(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTUREMMIN\" \"NULLSWAPIFNOT2\";\n(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTIREMMIN\" \"NULLSWAPIFNOT2\";\n(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTIREMMIN\" \"NULLSWAPIFNOT2\";\n(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTREMMIN\" \"NULLSWAPIFNOT2\";\n(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTREMMIN\" \"NULLSWAPIFNOT2\";\n(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTUREMMAX\" \"NULLSWAPIFNOT2\";\n(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTUREMMAX\" \"NULLSWAPIFNOT2\";\n(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTIREMMAX\" \"NULLSWAPIFNOT2\";\n(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTIREMMAX\" \"NULLSWAPIFNOT2\";\n(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTREMMAX\" \"NULLSWAPIFNOT2\";\n(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) \"DICTREMMAX\" \"NULLSWAPIFNOT2\";\n(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) \"DICTUMIN\" \"NULLSWAPIFNOT2\";\n(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) \"DICTUMAX\" \"NULLSWAPIFNOT2\";\n(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) \"DICTUMINREF\" \"NULLSWAPIFNOT2\";\n(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) \"DICTUMAXREF\" \"NULLSWAPIFNOT2\";\n(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) \"DICTIMIN\" \"NULLSWAPIFNOT2\";\n(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) \"DICTIMAX\" \"NULLSWAPIFNOT2\";\n(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) \"DICTIMINREF\" \"NULLSWAPIFNOT2\";\n(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) \"DICTIMAXREF\" \"NULLSWAPIFNOT2\";\n(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) \"DICTUGETNEXT\" \"NULLSWAPIFNOT2\";\n(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) \"DICTUGETNEXTEQ\" \"NULLSWAPIFNOT2\";\n(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) \"DICTUGETPREV\" \"NULLSWAPIFNOT2\";\n(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) \"DICTUGETPREVEQ\" \"NULLSWAPIFNOT2\";\n(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) \"DICTIGETNEXT\" \"NULLSWAPIFNOT2\";\n(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) \"DICTIGETNEXTEQ\" \"NULLSWAPIFNOT2\";\n(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) \"DICTIGETPREV\" \"NULLSWAPIFNOT2\";\n(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) \"DICTIGETPREVEQ\" \"NULLSWAPIFNOT2\";\n\n;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL\ncell new_dict() asm \"NEWDICT\";\n;;; Checks whether a dictionary is empty. Equivalent to cell_null?.\nint dict_empty?(cell c) asm \"DICTEMPTY\";\n\n\n{- Prefix dictionary primitives -}\n(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) \"PFXDICTGETQ\" \"NULLSWAPIFNOT2\";\n(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) \"PFXDICTSET\";\n(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) \"PFXDICTDEL\";\n\n;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.\ncell config_param(int x) asm \"CONFIGOPTPARAM\";\n;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.\nint cell_null?(cell c) asm \"ISNULL\";\n\n;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.\n() raw_reserve(int amount, int mode) impure asm \"RAWRESERVE\";\n;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.\n() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm \"RAWRESERVEX\";\n;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.\n() send_raw_message(cell msg, int mode) impure asm \"SENDRAWMSG\";\n;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract\n() set_code(cell new_code) impure asm \"SETCODE\";\n\n;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.\nint random() impure asm \"RANDU256\";\n;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.\nint rand(int range) impure asm \"RAND\";\n;;; Returns the current random seed as an unsigned 256-bit Integer.\nint get_seed() impure asm \"RANDSEED\";\n;;; Sets the random seed to unsigned 256-bit seed.\n() set_seed(int x) impure asm \"SETRAND\";\n;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.\n() randomize(int x) impure asm \"ADDRAND\";\n;;; Equivalent to randomize(cur_lt());.\n() randomize_lt() impure asm \"LTIME\" \"ADDRAND\";\n\n;;; Checks whether the data parts of two slices coinside\nint equal_slice_bits(slice a, slice b) asm \"SDEQ\";\nint equal_slices(slice a, slice b) asm \"SDEQ\";\n\n;;; Concatenates two builders\nbuilder store_builder(builder to, builder from) asm \"STBR\";"
            }
        },
        {
            "id": 4,
            "parent": 3,
            "text": "imports",
            "droppable": true,
            "data": {
                "type": "directory",
                "value": ""
            }
        },
        {
            "id": 6,
            "parent": 3,
            "text": "mo.fc",
            "droppable": false,
            "data": {
                "type": "file",
                "value": "#include \"imports/stdlib.fc\";\n\n() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {\n\n}\n"
            }
        },
        {
            "id": 3,
            "parent": 1,
            "text": "contracts",
            "droppable": true,
            "data": {
                "type": "directory",
                "value": ""
            }
        },
        {
            "id": 7,
            "parent": 1,
            "text": "jest.config.ts",
            "droppable": false,
            "data": {
                "type": "file",
                "value": "import type { Config } from 'jest';\n\nconst config: Config = {\n    preset: 'ts-jest',\n    testEnvironment: 'node',\n    testPathIgnorePatterns: ['/node_modules/', '/dist/'],\n};\n\nexport default config;\n"
            }
        },
        {
            "id": 8,
            "parent": 1,
            "text": "package.json",
            "droppable": false,
            "data": {
                "type": "file",
                "value": "{\n    \"name\": \"1\",\n    \"version\": \"0.0.1\",\n    \"license\": \"MIT\",\n    \"scripts\": {\n        \"test\": \"jest\"\n    },\n    \"devDependencies\": {\n        \"@ton-community/blueprint\": \"^0.10.0\",\n        \"@ton-community/sandbox\": \"^0.11.0\",\n        \"@ton-community/test-utils\": \"^0.2.0\",\n        \"@types/jest\": \"^29.5.0\",\n        \"@types/node\": \"^20.2.5\",\n        \"jest\": \"^29.5.0\",\n        \"prettier\": \"^2.8.6\",\n        \"ton\": \"^13.4.1\",\n        \"ton-core\": \"^0.49.0\",\n        \"ton-crypto\": \"^3.2.0\",\n        \"ts-jest\": \"^29.0.5\",\n        \"ts-node\": \"^10.9.1\",\n        \"typescript\": \"^4.9.5\"\n    }\n}\n"
            }
        },
        {
            "id": 10,
            "parent": 9,
            "text": "deployMo.ts",
            "droppable": false,
            "data": {
                "type": "file",
                "value": "import { toNano } from 'ton-core';\nimport { Mo } from '../wrappers/Mo';\nimport { compile, NetworkProvider } from '@ton-community/blueprint';\n\nexport async function run(provider: NetworkProvider) {\n    const mo = provider.open(Mo.createFromConfig({}, await compile('Mo')));\n\n    await mo.sendDeploy(provider.sender(), toNano('0.05'));\n\n    await provider.waitForDeploy(mo.address);\n\n    // run methods on `mo`\n}\n"
            }
        },
        {
            "id": 9,
            "parent": 1,
            "text": "scripts",
            "droppable": true,
            "data": {
                "type": "directory",
                "value": ""
            }
        },
        {
            "id": 12,
            "parent": 11,
            "text": "Mo.spec.ts",
            "droppable": false,
            "data": {
                "type": "file",
                "value": "import { Blockchain, SandboxContract } from '@ton-community/sandbox';\nimport { Cell, toNano } from 'ton-core';\nimport { Mo } from '../wrappers/Mo';\nimport '@ton-community/test-utils';\nimport { compile } from '@ton-community/blueprint';\n\ndescribe('Mo', () => {\n    let code: Cell;\n\n    beforeAll(async () => {\n        code = await compile('Mo');\n    });\n\n    let blockchain: Blockchain;\n    let mo: SandboxContract<Mo>;\n\n    beforeEach(async () => {\n        blockchain = await Blockchain.create();\n\n        mo = blockchain.openContract(Mo.createFromConfig({}, code));\n\n        const deployer = await blockchain.treasury('deployer');\n\n        const deployResult = await mo.sendDeploy(deployer.getSender(), toNano('0.05'));\n\n        expect(deployResult.transactions).toHaveTransaction({\n            from: deployer.address,\n            to: mo.address,\n            deploy: true,\n            success: true,\n        });\n    });\n\n    it('should deploy', async () => {\n        // the check is done inside beforeEach\n        // blockchain and mo are ready to use\n    });\n});\n"
            }
        },
        {
            "id": 11,
            "parent": 1,
            "text": "tests",
            "droppable": true,
            "data": {
                "type": "directory",
                "value": ""
            }
        },
        {
            "id": 13,
            "parent": 1,
            "text": "tsconfig.json",
            "droppable": false,
            "data": {
                "type": "file",
                "value": "{\n    \"compilerOptions\": {\n        \"target\": \"ES2020\",\n        \"outDir\": \"dist\",\n        \"module\": \"commonjs\",\n        \"declaration\": true,\n        \"esModuleInterop\": true,\n        \"forceConsistentCasingInFileNames\": true,\n        \"strict\": true,\n        \"skipLibCheck\": true\n    }\n}\n"
            }
        },
        {
            "id": 15,
            "parent": 14,
            "text": "Mo.compile.ts",
            "droppable": false,
            "data": {
                "type": "file",
                "value": "import { CompilerConfig } from '@ton-community/blueprint';\n\nexport const compile: CompilerConfig = {\n    lang: 'func',\n    targets: ['contracts/mo.fc'],\n};\n"
            }
        },
        {
            "id": 16,
            "parent": 14,
            "text": "Mo.ts",
            "droppable": false,
            "data": {
                "type": "file",
                "value": "import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';\n\nexport type MoConfig = {};\n\nexport function moConfigToCell(config: MoConfig): Cell {\n    return beginCell().endCell();\n}\n\nexport class Mo implements Contract {\n    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}\n\n    static createFromAddress(address: Address) {\n        return new Mo(address);\n    }\n\n    static createFromConfig(config: MoConfig, code: Cell, workchain = 0) {\n        const data = moConfigToCell(config);\n        const init = { code, data };\n        return new Mo(contractAddress(workchain, init), init);\n    }\n\n    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {\n        await provider.internal(via, {\n            value,\n            sendMode: SendMode.PAY_GAS_SEPARATELY,\n            body: beginCell().endCell(),\n        });\n    }\n}\n"
            }
        },
        {
            "id": 14,
            "parent": 1,
            "text": "wrappers",
            "droppable": true,
            "data": {
                "type": "directory",
                "value": ""
            }
        },
        {
            "id": 1,
            "parent": 0,
            "text": "1",
            "droppable": true,
            "data": {
                "type": "directory",
                "value": ""
            }
        }
    ];
    selectedNode?: NodeModel | null = null;
    lastId = 100;
    setFiles = (files: NodeModel[]) => this.files = files;
    setSelectedNode = (node: NodeModel) => this.selectedNode = node;
    setLastId = (lastId: number) => this.lastId = lastId;
    store: RootStoreModel;

    get selectFile() {
        if (!this.selectedNode) return toJS(this.currentFile);
        if (!this.selectedNode.droppable) {
            this.currentFile = this.selectedNode;
            return toJS(this.selectedNode);
        }
        return toJS(this.currentFile);
    }

    changeFile = (file: NodeModel, index: number) => {
        if(this.files) {
            this.files[index] = file
            console.log("file", file)
        }
    }

    changeFileName = (file: any, index: number) => {
        console.log("this.files", toJS(this.files));
        if (this.files && this.files[index]) {
            this.files[index] = file;
            return toJS(this.files);
        }
        return null;
    }

    deleteFile = (id: number | string) => {
        console.log("this.files", toJS(this.files));
        if (this.files) {
            const files = this.files.filter((file,) => file.id !== id);
            this.files = files;
           // this.files.splice(index, 1);
        }
    }

    setRootDirectory = (nameDirectory: string) => {
        this.rootDirectory = nameDirectory;
    }

    constructor(protected rootStore: RootStoreModel) {
        this.store = rootStore;
        makeObservable(this, {
            files: observable,
            rootDirectory: observable,
            selectedNode: observable,
            lastId: observable,
            setSelectedNode: action,
            setFiles: action,
            changeFile: action,
            setLastId: action,
            changeFileName: action,
            deleteFile: action,
            setRootDirectory: action,
            selectFile: computed

        });

    }


}
