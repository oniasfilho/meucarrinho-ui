"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/shared/components/Button/Button";

import styles from "./AddItemForm.module.css";

interface AddItemFormValues {
  name: string;
  unitPrice: number;
  quantity: number;
  note: string | null;
}

interface AddItemFormProps {
  isSubmitting: boolean;
  errorMessage?: string | undefined;
  onSave(input: AddItemFormValues): Promise<boolean>;
  onClose(): void;
}

export function AddItemForm({
  isSubmitting,
  errorMessage,
  onSave,
  onClose,
}: AddItemFormProps) {
  const [name, setName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");

  const isValid =
    name.trim().length > 0 &&
    unitPrice.trim().length > 0 &&
    Number(unitPrice) >= 0 &&
    Number.isInteger(Number(quantity)) &&
    Number(quantity) >= 1;

  function resetFields(): void {
    setName("");
    setUnitPrice("");
    setQuantity("1");
    setNote("");
  }

  async function submit(keepOpen: boolean): Promise<void> {
    if (!isValid || isSubmitting) {
      return;
    }

    const succeeded = await onSave({
      name: name.trim(),
      unitPrice: Number(unitPrice),
      quantity: Number(quantity),
      note: note.trim().length > 0 ? note.trim() : null,
    });

    if (!succeeded) {
      return;
    }

    resetFields();

    if (!keepOpen) {
      onClose();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void submit(false);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Adicionar item">
      <div className={styles.field}>
        <label htmlFor="add-item-name">Nome</label>
        <input
          id="add-item-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="add-item-price">Preço unitário</label>
          <input
            id="add-item-price"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="add-item-quantity">Quantidade</label>
          <input
            id="add-item-quantity"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="add-item-note">Nota (opcional)</label>
        <input
          id="add-item-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>
      {errorMessage ? (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <div className={styles.actions}>
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Salvando…" : "Salvar"}
        </Button>
        <Button
          type="button"
          disabled={!isValid || isSubmitting}
          onClick={() => void submit(true)}
        >
          Salvar e adicionar outro
        </Button>
        <Button type="button" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
