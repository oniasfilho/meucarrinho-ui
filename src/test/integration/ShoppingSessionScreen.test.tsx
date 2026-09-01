import { http, HttpResponse } from "msw";

import type { ShoppingSessionDto } from "@/contracts/shopping-session/shoppingSession.dto";
import { ShoppingSessionScreen } from "@/features/shopping-session";
import { activeSessionDto } from "@/test/mocks/handlers";
import { server } from "@/test/mocks/server";
import { render, screen } from "@/test/render";

const detailUrl = `http://localhost/api/bff/sessions/${activeSessionDto.id}`;

function useDetailResponse(dto: ShoppingSessionDto) {
  server.use(http.get(detailUrl, () => HttpResponse.json(dto)));
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
