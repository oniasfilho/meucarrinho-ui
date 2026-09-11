import { http, HttpResponse, delay } from "msw";
import userEvent from "@testing-library/user-event";

import type { ShoppingSessionDetailDto } from "@/contracts/shopping-session/shoppingSessionDetail.dto";
import type { ShoppingSessionItemDto } from "@/contracts/shopping-session/shoppingSessionItem.dto";
import { ShoppingSessionScreen } from "@/features/shopping-session";
import { activeSessionDetailDto as activeSessionDto } from "@/test/mocks/handlers";
import { server } from "@/test/mocks/server";
import { render, screen } from "@/test/render";

const detailUrl = `http://localhost/api/bff/sessions/${activeSessionDto.id}`;

function quantityUrl(itemId: string): string {
  return `http://localhost/api/bff/sessions/${activeSessionDto.id}/items/${itemId}/quantity`;
}

const itemsUrl = `http://localhost/api/bff/sessions/${activeSessionDto.id}/items`;

function useDetailResponse(dto: ShoppingSessionDetailDto) {
  server.use(http.get(detailUrl, () => HttpResponse.json(dto)));
}

const riceItemDto: ShoppingSessionItemDto = {
  id: "6c8b1e3a-2c2b-4c2e-9c2e-2c2b4c2e9c2e",
  name: "Arroz",
  unitPrice: 25.9,
  quantity: 2,
  note: null,
  labelPhotoKey: null,
  labelPhotoUrl: null,
  createdAt: "2026-08-31T12:00:00.000Z",
  updatedAt: "2026-08-31T12:00:00.000Z",
};

function detailWithRiceItem(
  item: ShoppingSessionItemDto = riceItemDto,
): ShoppingSessionDetailDto {
  return {
    ...activeSessionDto,
    budget: 200,
    itemCount: item.quantity,
    total: item.unitPrice * item.quantity,
    remainingBudget: 200 - item.unitPrice * item.quantity,
    overBudget: false,
    items: [item],
  };
}

describe("ShoppingSessionScreen", () => {
  it("renders the session header and summary from a 200 DTO", async () => {
    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: activeSessionDto.name,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ativa")).toBeInTheDocument();
    expect(screen.getByText("28/08/2026")).toBeInTheDocument();
    expect(screen.getByText("6 itens")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s184,70/)).toBeInTheDocument();
  });

  it("renders the empty-item state for a zero count", async () => {
    useDetailResponse({
      ...activeSessionDto,
      itemCount: 0,
      total: 0,
    });

    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    expect(
      await screen.findByRole("heading", {
        level: 2,
        name: "Itens da sessão",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sua sessão ainda não tem itens."),
    ).toBeInTheDocument();
  });

  it("renders items, notes, and budget progress from a detail with items", async () => {
    useDetailResponse({
      ...activeSessionDto,
      storeName: "Mercado Central",
      budget: 200,
      itemCount: 5,
      total: 51.8,
      remainingBudget: 148.2,
      overBudget: false,
      items: [
        {
          id: "6c8b1e3a-2c2b-4c2e-9c2e-2c2b4c2e9c2e",
          name: "Arroz",
          unitPrice: 25.9,
          quantity: 2,
          note: "marca preferida",
          labelPhotoKey: null,
          labelPhotoUrl: null,
          createdAt: "2026-08-31T12:00:00.000Z",
          updatedAt: "2026-08-31T12:00:00.000Z",
        },
      ],
    });

    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    expect(await screen.findByText("Mercado Central")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Itens da sessão" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Arroz")).toBeInTheDocument();
    expect(screen.getByText("marca preferida")).toBeInTheDocument();
    expect(screen.getByText(/2 × R\$\s25,90/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s148,20 de R\$\s200,00/)).toBeInTheDocument();
  });

  it("disables the decrement button at quantity 1", async () => {
    useDetailResponse(detailWithRiceItem({ ...riceItemDto, quantity: 1 }));

    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    expect(
      await screen.findByRole("button", {
        name: "Diminuir quantidade de Arroz",
      }),
    ).toBeDisabled();
  });

  it("optimistically updates quantity and totals, then keeps the server state", async () => {
    useDetailResponse(detailWithRiceItem());
    server.use(
      http.patch(quantityUrl(riceItemDto.id), async () => {
        await delay(50);

        return HttpResponse.json(
          detailWithRiceItem({ ...riceItemDto, quantity: 3 }),
        );
      }),
    );

    const user = userEvent.setup();
    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    await screen.findByText(/2 × R\$\s25,90/);

    await user.click(
      screen.getByRole("button", { name: "Aumentar quantidade de Arroz" }),
    );

    expect(await screen.findByText(/3 × R\$\s25,90/)).toBeInTheDocument();

    await screen.findByText(/R\$\s122,30 de R\$\s200,00/);
    expect(screen.getByText(/3 × R\$\s25,90/)).toBeInTheDocument();
  });

  it("rolls back the optimistic quantity update and shows an error on failure", async () => {
    useDetailResponse(detailWithRiceItem());
    server.use(
      http.patch(quantityUrl(riceItemDto.id), () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const user = userEvent.setup();
    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    await screen.findByText(/2 × R\$\s25,90/);

    await user.click(
      screen.getByRole("button", { name: "Aumentar quantidade de Arroz" }),
    );

    expect(
      await screen.findByText(
        "Não foi possível atualizar a quantidade. Tente novamente.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/2 × R\$\s25,90/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s148,20 de R\$\s200,00/)).toBeInTheDocument();
  });

  it("adds an item, closes the form on Salvar, and updates the cache", async () => {
    useDetailResponse({ ...activeSessionDto, itemCount: 0, total: 0, items: [] });
    server.use(
      http.post(itemsUrl, () => HttpResponse.json(detailWithRiceItem(), { status: 201 })),
    );

    const user = userEvent.setup();
    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    await user.click(await screen.findByRole("button", { name: "Adicionar item" }));

    await user.type(screen.getByLabelText("Nome"), "Arroz");
    await user.type(screen.getByLabelText("Preço unitário"), "25.9");
    await user.clear(screen.getByLabelText("Quantidade"));
    await user.type(screen.getByLabelText("Quantidade"), "2");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Arroz")).toBeInTheDocument();
    expect(
      screen.queryByRole("form", { name: "Adicionar item" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Adicionar item" }),
    ).toBeInTheDocument();
  });

  it("keeps the form open and resets fields after Salvar e adicionar outro", async () => {
    useDetailResponse({ ...activeSessionDto, itemCount: 0, total: 0, items: [] });
    server.use(
      http.post(itemsUrl, () => HttpResponse.json(detailWithRiceItem(), { status: 201 })),
    );

    const user = userEvent.setup();
    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    await user.click(await screen.findByRole("button", { name: "Adicionar item" }));

    await user.type(screen.getByLabelText("Nome"), "Arroz");
    await user.type(screen.getByLabelText("Preço unitário"), "25.9");
    await user.click(
      screen.getByRole("button", { name: "Salvar e adicionar outro" }),
    );

    expect(await screen.findByText("Arroz")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toHaveValue("");
    expect(screen.getByRole("form", { name: "Adicionar item" })).toBeInTheDocument();
  });

  it("keeps the form open and shows an error when adding an item fails", async () => {
    useDetailResponse({ ...activeSessionDto, itemCount: 0, total: 0, items: [] });
    server.use(
      http.post(itemsUrl, () => HttpResponse.json(null, { status: 500 })),
    );

    const user = userEvent.setup();
    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    await user.click(await screen.findByRole("button", { name: "Adicionar item" }));

    await user.type(screen.getByLabelText("Nome"), "Arroz");
    await user.type(screen.getByLabelText("Preço unitário"), "25.9");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(
      await screen.findByText("Não foi possível adicionar o item. Tente novamente."),
    ).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Adicionar item" })).toBeInTheDocument();
  });

  it("does not offer Adicionar item for a completed session", async () => {
    useDetailResponse({
      ...detailWithRiceItem(),
      status: "COMPLETED",
      completedAt: "2026-08-31T18:00:00.000Z",
    });

    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    await screen.findByText("Arroz");
    expect(
      screen.queryByRole("button", { name: "Adicionar item" }),
    ).not.toBeInTheDocument();
  });

  it("renders the not-found state for a 404", async () => {
    server.use(
      http.get(detailUrl, () =>
        HttpResponse.json({ code: "SESSION_NOT_FOUND" }, { status: 404 }),
      ),
    );

    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Sessão não encontrada",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Voltar para o início" }),
    ).toHaveAttribute("href", "/");
  });

  it("renders generic retry feedback for a 503", async () => {
    server.use(
      http.get(detailUrl, () =>
        HttpResponse.json({ code: "BFF_UNAVAILABLE" }, { status: 503 }),
      ),
    );

    render(<ShoppingSessionScreen sessionId={activeSessionDto.id} />);

    expect(
      await screen.findByText("Não foi possível carregar esta sessão."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tentar novamente" }),
    ).toBeInTheDocument();
  });
});
