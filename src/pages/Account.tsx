import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Order, OrderStatus } from "../types";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";
import PageHeader from "../components/layout/PageHeader";
import Button, { LinkButton } from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import {
  IconUser,
  IconCheck,
  IconChat,
  IconShield,
} from "../components/art/Icons";
import "./Account.css";
import { useSeo } from "../lib/seo";

const STATUS_STAGES: OrderStatus[] = [
  "Clinician review",
  "Approved",
  "Dispensing",
  "Dispatched",
  "Delivered",
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Account() {
  useSeo({ title: "Your account", description: "Manage your Vyra Health orders, treatment and account details.", path: "/account", noindex: true });
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const justOrdered = (location.state as { justOrdered?: boolean } | null)
    ?.justOrdered === true;

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [advancingId, setAdvancingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    api
      .getOrders(user.id)
      .then((o) => setOrders(o))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  async function handleLogout() {
    await logOut();
    navigate("/");
  }

  async function handleAdvance(orderId: string) {
    setAdvancingId(orderId);
    try {
      const updated = await api.advanceOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      );
    } finally {
      setAdvancingId(null);
    }
  }

  if (!user) {
    return (
      <div className="account">
        <PageHeader
          eyebrow="My account"
          title="Please sign in"
        />
        <section className="section-sm container">
          <motion.div
            className="account__gate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="account__gate-icon">
              <IconUser size={32} />
            </div>
            <h2>You're not signed in</h2>
            <p>
              Sign in or create a free account to view your orders and manage
              your treatment journey.
            </p>
            <LinkButton to="/login" size="lg">
              Sign in or create account
            </LinkButton>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="account">
      <PageHeader
        eyebrow="My account"
        title={`Hello, ${user.name.split(" ")[0]}`}
        subtitle="Manage your orders, track delivery and access clinician support."
      />

      <main className="section-sm container">
        {/* Success banner */}
        <AnimatePresence>
          {justOrdered && (
            <motion.div
              className="account__success-banner"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="account__success-banner-icon">
                <IconCheck size={18} />
              </div>
              <div>
                <strong>Order placed — a clinician is reviewing it now.</strong>
                <p>
                  You'll hear from us within 24 hours. Track progress below.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="account__body">
          {/* Profile sidebar */}
          <Reveal from="right">
            <div className="account__profile">
              <div className="account__avatar">{getInitials(user.name)}</div>
              <p className="account__name">{user.name}</p>
              <p className="account__email">{user.email}</p>
              <div className="account__meta">
                <div className="account__meta-row">
                  <span className="account__meta-key">Member since</span>
                  <span className="account__meta-val">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
                <div className="account__meta-row">
                  <span className="account__meta-key">Orders</span>
                  <span className="account__meta-val">{orders.length}</span>
                </div>
              </div>
              <div className="account__logout">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Orders */}
          <div>
            <div className="account__orders-head">
              <h2>Your orders</h2>
            </div>

            {ordersLoading && (
              <div className="account__orders-loading">
                <span className="account__orders-spinner" aria-hidden="true" />
                Loading your orders…
              </div>
            )}

            {!ordersLoading && orders.length === 0 && (
              <Reveal>
                <div className="account__orders-empty">
                  <p>You haven't placed any orders yet.</p>
                  <LinkButton to="/#products">Browse treatments</LinkButton>
                </div>
              </Reveal>
            )}

            <AnimatePresence>
              {orders.map((order, i) => (
                <Reveal key={order.id} index={i}>
                  <OrderCard
                    order={order}
                    advancing={advancingId === order.id}
                    onAdvance={() => handleAdvance(order.id)}
                  />
                </Reveal>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---- Order card sub-component ---- */

function OrderCard({
  order,
  advancing,
  onAdvance,
}: {
  order: Order;
  advancing: boolean;
  onAdvance: () => void;
}) {
  const currentIdx = STATUS_STAGES.indexOf(order.status);

  return (
    <div className="account__order">
      {/* Header */}
      <div className="account__order-header">
        <div>
          <p className="account__order-id">Order {order.id}</p>
          <p className="account__order-date">
            Placed {formatDate(order.placedAt)}
          </p>
        </div>
        <span className="account__order-total">
          £{order.total.toFixed(2)}
        </span>
      </div>

      {/* Body */}
      <div className="account__order-body">
        {/* Items */}
        <div className="account__order-items">
          {order.items.map((item) => (
            <div key={item.doseId} className="account__order-item">
              <div>
                <span className="account__order-item-name">
                  {item.productName}
                </span>
                <span className="account__order-item-meta">
                  {" "}
                  &middot; {item.doseLabel} {item.strength} &times;{" "}
                  {item.quantity}
                </span>
              </div>
              <span className="account__order-item-price">
                £{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Status timeline */}
        <div className="account__timeline">
          <p className="account__timeline-label">Fulfilment status</p>
          <div className="account__timeline-steps">
            {STATUS_STAGES.map((stage, idx) => {
              const isDone = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const cls = [
                "account__timeline-step",
                isDone ? "account__timeline-step--done" : "",
                isCurrent ? "account__timeline-step--current" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div key={stage} className={cls}>
                  <div className="account__timeline-dot">
                    {isDone && <IconCheck size={14} />}
                    {isCurrent && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "var(--green-600)",
                          display: "block",
                        }}
                      />
                    )}
                  </div>
                  <span className="account__timeline-name">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinician note */}
        <div className="account__clinician-note">
          <IconChat size={18} />
          <div className="account__clinician-note-body">
            <strong>Clinician update</strong>
            <p>{order.clinicianNote}</p>
          </div>
        </div>

        {/* Shipping address summary */}
        <div
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--space-2)",
          }}
        >
          <IconShield size={15} />
          <span>
            Shipping to {order.address.fullName}, {order.address.line1},{" "}
            {order.address.city}, {order.address.postcode}
          </span>
        </div>
      </div>

      {/* Footer: demo advance */}
      <div className="account__order-footer">
        <Button
          variant="ghost"
          size="sm"
          disabled={order.status === "Delivered" || advancing}
          onClick={onAdvance}
        >
          {advancing ? "Updating…" : "Advance status (demo)"}
        </Button>
      </div>
    </div>
  );
}
