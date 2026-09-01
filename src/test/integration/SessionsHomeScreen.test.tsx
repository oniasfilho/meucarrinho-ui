import { http, HttpResponse, delay } from "msw";
import userEvent from "@testing-library/user-event";

import { SessionsHomeScreen } from "@/features/shopping-session";
import { activeSessionDto, createdSessionDto } from "@/test/mocks/handlers";
import { server } from "@/test/mocks/server";
import { fireEvent, render, screen, waitFor } from "@/test/render";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const sessionsUrl = "http://localhost/api/bff/sessions";

function useEmptySessions() {
  server.use(http.get(sessionsUrl, () => HttpResponse.json([])));
}

describe("SessionsHomeScreen", () => {
  it("renders the loading indicator during a delayed GET", async () => {
    server.use(
      http.get(sessionsUrl, async () => {
        await delay(100);
        return HttpResponse.json([activeSessionDto]);
      }),
    );

    render(<SessionsHomeScreen />);

    expect(screen.getByText("Carregando sessões…")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", {
        name: `Abrir sessão ${activeSessionDto.name}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders the empty state for an empty DTO array", async () => {
    useEmptySessions();

    render(<SessionsHomeScreen />);

    expect(
      await screen.findByRole("heading", {
        level: 2,
        name: "Nenhuma sessão por aqui",
      }),
    ).toBeInTheDocument();
  });

  it("renders one mapped session with formatted summary values", async () => {
    render(<SessionsHomeScreen />);

    expect(
      await screen.findByRole("button", {
        name: `Abrir sessão ${activeSessionDto.name}`,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ativa")).toBeInTheDocument();
    expect(screen.getByText("28/08/2026")).toBeInTheDocument();
    expect(screen.getByText("6 itens")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s184,70/)).toBeInTheDocument();
  });

  it("rejects malformed network data at the transform boundary", async () => {
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    server.use(
      http.get(sessionsUrl, () =>
        HttpResponse.json([{ ...activeSessionDto, createdAt: "not-a-date" }]),
      ),
    );

    render(<SessionsHomeScreen />);

    expect(
      await screen.findByText(
        "Não foi possível carregar suas sessões. Tente novamente.",
      ),
    ).toBeInTheDocument();
    consoleErrorMock.mockRestore();
  });

  it("renders a GET error and recovers when retry succeeds", async () => {
    let requestCount = 0;

    server.use(
      http.get(sessionsUrl, () => {
        requestCount += 1;

        if (requestCount === 1) {
          return HttpResponse.json(null, { status: 500 });
        }

        return HttpResponse.json([activeSessionDto]);
      }),
    );

    const user = userEvent.setup();
    render(<SessionsHomeScreen />);

    expect(
      await screen.findByText(
        "Não foi possível carregar suas sessões. Tente novamente.",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(
      await screen.findByRole("button", {
        name: `Abrir sessão ${activeSessionDto.name}`,
      }),
    ).toBeInTheDocument();
    expect(requestCount).toBe(2);
  });

  it("navigates to a session returned by POST 201", async () => {
    useEmptySessions();
    server.use(
      http.post(sessionsUrl, () =>
        HttpResponse.json(createdSessionDto, { status: 201 }),
      ),
    );

    const user = userEvent.setup();
    render(<SessionsHomeScreen />);

    await screen.findByRole("heading", {
      level: 2,
      name: "Nenhuma sessão por aqui",
    });
    await user.click(screen.getByRole("button", { name: "Nova sessão" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        `/sessions/${createdSessionDto.id}`,
      );
    });
  });

  it("stays on Home and renders a creation error after POST 503", async () => {
    useEmptySessions();
    server.use(
      http.post(sessionsUrl, () =>
        HttpResponse.json({ code: "BFF_UNAVAILABLE" }, { status: 503 }),
      ),
    );

    const user = userEvent.setup();
    render(<SessionsHomeScreen />);

    await screen.findByRole("heading", {
      level: 2,
      name: "Nenhuma sessão por aqui",
    });
    await user.click(screen.getByRole("button", { name: "Nova sessão" }));

    expect(
      await screen.findByText(
        "Não foi possível criar a sessão. Tente novamente.",
      ),
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("disables the create button during a delayed POST", async () => {
    useEmptySessions();
    server.use(
      http.post(sessionsUrl, async () => {
        await delay(100);
        return HttpResponse.json(createdSessionDto, { status: 201 });
      }),
    );

    const user = userEvent.setup();
    render(<SessionsHomeScreen />);

    await screen.findByRole("heading", {
      level: 2,
      name: "Nenhuma sessão por aqui",
    });
    await user.click(screen.getByRole("button", { name: "Nova sessão" }));

    expect(screen.getByRole("button", { name: "Criando…" })).toBeDisabled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        `/sessions/${createdSessionDto.id}`,
      );
    });
  });

  it("sends only one POST for two rapid clicks", async () => {
    let postCount = 0;
    useEmptySessions();
    server.use(
      http.post(sessionsUrl, async () => {
        postCount += 1;
        await delay(100);
        return HttpResponse.json(createdSessionDto, { status: 201 });
      }),
    );

    render(<SessionsHomeScreen />);

    await screen.findByRole("heading", {
      level: 2,
      name: "Nenhuma sessão por aqui",
    });
    const createButton = screen.getByRole("button", { name: "Nova sessão" });

    fireEvent.click(createButton);
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        `/sessions/${createdSessionDto.id}`,
      );
    });
    expect(postCount).toBe(1);
  });
});
