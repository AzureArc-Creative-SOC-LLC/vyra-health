import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { LinkButton } from "../components/ui/Button";
import { IconArrow, IconCart, IconLock } from "../components/art/Icons";
import { getProductBySlug } from "../data/products";
import { useSeo } from "../lib/seo";
import "./Cart.css";

const SHIPPING_FEE: number = 0; // free UK delivery
const shippingLabel = "Discreet dispatch";

/** Cart page — Lunvera-style editorial layout. */
export default function Cart() {
  useSeo({ title: "Your cart", description: "Review the items in your Vyra Health cart before checkout.", path: "/cart", noindex: true });
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();
  const total = subtotal + SHIPPING_FEE;
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="cart">
        <div className="container">
          <div className="cart__head">
            <span className="cart__eyebrow">Your selection</span>
            <h1 className="cart__title">Cart</h1>
          </div>

          <motion.div
            className="cart__empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="cart__empty-icon">
              <IconCart size={26} />
            </span>
            <h2>No items yet</h2>
            <p>
              You haven't added a treatment to your basket. Browse the range to
              find the one that suits your goals.
            </p>
            <LinkButton to="/#products" size="lg" arrow>
              Browse treatments
            </LinkButton>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        <div className="cart__head">
          <span className="cart__eyebrow">Your selection</span>
          <h1 className="cart__title">Cart</h1>
        </div>

        <div className="cart__grid">
          {/* Items column */}
          <div className="cart__items-col">
            <div className="cart__items-head">
              <span>{itemCount} item{itemCount === 1 ? "" : "s"}</span>
              <button
                type="button"
                className="cart__clear"
                onClick={clear}
              >
                Clear cart
              </button>
            </div>

            <ul className="cart__items" aria-label="Items in your cart">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const product = getProductBySlug(item.productSlug);
                  const img = product?.img ?? "/images/alluvi-product.jpeg";
                  return (
                    <motion.li
                      key={item.doseId}
                      className="cart__item"
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 24, height: 0, padding: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={`/product/${item.productSlug}`}
                        className="cart__item-thumb"
                        aria-label={`View ${item.productName}`}
                      >
                        <img src={img} alt="" loading="lazy" />
                      </Link>

                      <div className="cart__item-body">
                        <span className="cart__item-cat">
                          {product?.compoundClass ?? "Compound"}
                        </span>
                        <Link
                          to={`/product/${item.productSlug}`}
                          className="cart__item-name"
                        >
                          {item.productName}
                        </Link>
                        <span className="cart__item-dose">
                          {item.doseLabel} · {item.strength}
                        </span>

                        <div className="cart__item-actions">
                          <div className="cart__stepper" aria-label="Quantity">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                updateQuantity(item.doseId, item.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateQuantity(item.doseId, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            className="cart__remove"
                            onClick={() => removeItem(item.doseId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="cart__item-price">
                        £{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            <Link to="/#products" className="cart__continue">
              <IconArrow
                size={14}
                className="cart__continue-arrow"
              />
              Continue shopping
            </Link>
          </div>

          {/* Summary sidebar */}
          <aside className="cart__summary" aria-label="Order summary">
            <span className="cart__summary-eyebrow">Order summary</span>

            <div className="cart__summary-row">
              <span>
                Subtotal
                <em>
                  ({itemCount} item{itemCount === 1 ? "" : "s"})
                </em>
              </span>
              <strong>£{subtotal.toFixed(2)}</strong>
            </div>
            <div className="cart__summary-row">
              <span>
                Shipping <em>— {shippingLabel}</em>
              </span>
              <strong>
                {SHIPPING_FEE === 0 ? "Free" : `£${SHIPPING_FEE.toFixed(2)}`}
              </strong>
            </div>

            <div className="cart__summary-total">
              <span>Total</span>
              <strong>£{total.toFixed(2)}</strong>
            </div>
            <span className="cart__summary-tax">GBP · tax included</span>

            <LinkButton
              to="/checkout"
              size="lg"
              fullWidth
              className="cart__proceed"
            >
              Proceed to checkout
            </LinkButton>

            <span className="cart__secure">
              <IconLock size={13} /> Secure, encrypted checkout
            </span>
          </aside>
        </div>
      </div>
    </div>
  );
}
