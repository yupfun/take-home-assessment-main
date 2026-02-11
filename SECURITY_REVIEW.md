# SECURITY_REVIEW — SimpleToken.sol

This review covers `contracts/SimpleToken.sol` (a minimal ERC20-like token).

## Finding 1 — Missing zero-address checks in transfers
**Severity:** Medium

**Description:** `transfer()` and `transferFrom()` allow `to == address(0)`. This effectively burns tokens without reducing `totalSupply`, breaks common ERC-20 expectations, and can cause accounting/integration issues for downstream apps.

**Recommendation:** Add `require(to != address(0), "Zero address")` (and similarly validate `from` where applicable). If intentional burning is desired, implement an explicit `burn()` that decreases `totalSupply` and emits a `Transfer(from, address(0), amount)`.

---

## Finding 2 — ERC-20 approval race condition
**Severity:** Medium

**Description:** `approve(spender, amount)` overwrites an existing allowance directly. If an owner changes an allowance from non-zero to another non-zero value, a spender can front-run and spend both the old and the new allowance (classic ERC-20 allowance race).

**Recommendation:** Enforce a safe pattern: require setting allowance to zero before changing it to a new value, or add `increaseAllowance()` / `decreaseAllowance()` functions (preferred), or adopt OpenZeppelin ERC20 implementation.

---

## Finding 3 — Lack of basic input validation / ERC-20 compatibility hardening
**Severity:** Low

**Description:** The contract omits several hardening details commonly expected by wallets/indexers:
- No checks for `spender != address(0)` in `approve()`
- No custom errors / revert reasons consistency
- No `balanceOf`/`allowance` getters matching the ERC-20 interface signatures (public mappings are close but not identical to typical OZ patterns)

**Recommendation:** Add zero-address validation for `approve()`, consider custom errors for gas + clarity, and prefer using OpenZeppelin’s ERC20 reference implementation to match ecosystem expectations.
