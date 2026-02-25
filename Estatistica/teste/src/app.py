from __future__ import annotations

import re
import unicodedata
from pathlib import Path

import pandas as pd
import plotly.express as px
from dash import Dash, Input, Output, dcc, html


def normalize_column(name: str) -> str:
    cleaned = name.strip()
    cleaned = unicodedata.normalize("NFKD", cleaned)
    cleaned = "".join(ch for ch in cleaned if not unicodedata.combining(ch))
    cleaned = cleaned.replace(" ", "_").replace("/", "_").replace("-", "_")
    cleaned = re.sub(r"[^A-Za-z0-9_]", "_", cleaned)
    cleaned = re.sub(r"_+", "_", cleaned).strip("_")
    return cleaned


def load_data(csv_path: Path) -> pd.DataFrame:
    df = pd.read_csv(csv_path, encoding="latin1")
    df.columns = [normalize_column(col) for col in df.columns]

    for col in df.select_dtypes(include="object").columns:
        df[col] = df[col].astype(str).str.strip()

    numeric_cols = [
        "Idade",
        "Dependentes",
        "Meses_como_Cliente",
        "Produtos_Contratados",
        "Inatividade_12m",
        "Contatos_12m",
        "Limite",
        "Limite_Consumido",
        "Limite_Disponivel",
        "Mudancas_Transacoes_Q4_Q1",
        "Valor_Transacoes_12m",
        "Qtde_Transacoes_12m",
        "Mudanca_Qtde_Transacoes_Q4_Q1",
        "Taxa_de_Utilizacao_Cartao",
    ]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    return df


BASE_DIR = Path(__file__).resolve().parents[1]
CSV_PATH = BASE_DIR / "ClientesBanco.csv"

if not CSV_PATH.exists():
    raise FileNotFoundError(f"CSV not found: {CSV_PATH}")

df = load_data(CSV_PATH)

filter_columns = {
    "Categoria": "Categoria",
    "Sexo": "Sexo",
    "Estado_Civil": "Estado Civil",
    "Faixa_Salarial_Anual": "Faixa Salarial",
    "Categoria_Cartao": "Categoria Cartao",
}


def make_options(series: pd.Series) -> list[dict[str, str]]:
    values = sorted(v for v in series.dropna().unique() if v != "")
    return [{"label": v, "value": v} for v in values]


app = Dash(__name__)
app.title = "Dashboard Clientes Banco"

app.layout = html.Div(
    style={"fontFamily": "Arial, sans-serif", "padding": "24px"},
    children=[
        html.H1("Dashboard Clientes Banco"),
        html.Div(
            style={"display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(220px, 1fr))", "gap": "12px"},
            children=[
                html.Div(
                    [
                        html.Label(filter_columns["Categoria"]),
                        dcc.Dropdown(
                            id="f_categoria",
                            options=make_options(df["Categoria"]) if "Categoria" in df.columns else [],
                            value=sorted(df["Categoria"].dropna().unique()) if "Categoria" in df.columns else [],
                            multi=True,
                        ),
                    ]
                ),
                html.Div(
                    [
                        html.Label(filter_columns["Sexo"]),
                        dcc.Dropdown(
                            id="f_sexo",
                            options=make_options(df["Sexo"]) if "Sexo" in df.columns else [],
                            value=sorted(df["Sexo"].dropna().unique()) if "Sexo" in df.columns else [],
                            multi=True,
                        ),
                    ]
                ),
                html.Div(
                    [
                        html.Label(filter_columns["Estado_Civil"]),
                        dcc.Dropdown(
                            id="f_estado_civil",
                            options=make_options(df["Estado_Civil"]) if "Estado_Civil" in df.columns else [],
                            value=sorted(df["Estado_Civil"].dropna().unique()) if "Estado_Civil" in df.columns else [],
                            multi=True,
                        ),
                    ]
                ),
                html.Div(
                    [
                        html.Label(filter_columns["Faixa_Salarial_Anual"]),
                        dcc.Dropdown(
                            id="f_faixa",
                            options=make_options(df["Faixa_Salarial_Anual"]) if "Faixa_Salarial_Anual" in df.columns else [],
                            value=sorted(df["Faixa_Salarial_Anual"].dropna().unique()) if "Faixa_Salarial_Anual" in df.columns else [],
                            multi=True,
                        ),
                    ]
                ),
                html.Div(
                    [
                        html.Label(filter_columns["Categoria_Cartao"]),
                        dcc.Dropdown(
                            id="f_cartao",
                            options=make_options(df["Categoria_Cartao"]) if "Categoria_Cartao" in df.columns else [],
                            value=sorted(df["Categoria_Cartao"].dropna().unique()) if "Categoria_Cartao" in df.columns else [],
                            multi=True,
                        ),
                    ]
                ),
            ],
        ),
        html.Hr(),
        html.Div(
            style={"display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(200px, 1fr))", "gap": "12px"},
            children=[
                html.Div(id="kpi_total", style={"background": "#f5f5f5", "padding": "12px", "borderRadius": "8px"}),
                html.Div(id="kpi_cancelados", style={"background": "#f5f5f5", "padding": "12px", "borderRadius": "8px"}),
                html.Div(id="kpi_taxa", style={"background": "#f5f5f5", "padding": "12px", "borderRadius": "8px"}),
                html.Div(id="kpi_limite", style={"background": "#f5f5f5", "padding": "12px", "borderRadius": "8px"}),
                html.Div(id="kpi_transacoes", style={"background": "#f5f5f5", "padding": "12px", "borderRadius": "8px"}),
            ],
        ),
        html.Div(
            style={"display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(320px, 1fr))", "gap": "16px", "marginTop": "16px"},
            children=[
                dcc.Graph(id="fig_cancel_sexo"),
                dcc.Graph(id="fig_idade"),
                dcc.Graph(id="fig_limite_cartao"),
                dcc.Graph(id="fig_transacoes"),
            ],
        ),
    ],
)


@app.callback(
    Output("kpi_total", "children"),
    Output("kpi_cancelados", "children"),
    Output("kpi_taxa", "children"),
    Output("kpi_limite", "children"),
    Output("kpi_transacoes", "children"),
    Output("fig_cancel_sexo", "figure"),
    Output("fig_idade", "figure"),
    Output("fig_limite_cartao", "figure"),
    Output("fig_transacoes", "figure"),
    Input("f_categoria", "value"),
    Input("f_sexo", "value"),
    Input("f_estado_civil", "value"),
    Input("f_faixa", "value"),
    Input("f_cartao", "value"),
)
def update_dashboard(categoria, sexo, estado_civil, faixa, cartao):
    filtered = df.copy()

    if categoria:
        filtered = filtered[filtered["Categoria"].isin(categoria)]
    if sexo:
        filtered = filtered[filtered["Sexo"].isin(sexo)]
    if estado_civil:
        filtered = filtered[filtered["Estado_Civil"].isin(estado_civil)]
    if faixa:
        filtered = filtered[filtered["Faixa_Salarial_Anual"].isin(faixa)]
    if cartao:
        filtered = filtered[filtered["Categoria_Cartao"].isin(cartao)]

    total = len(filtered)
    cancelados = int((filtered["Categoria"] == "Cancelado").sum()) if "Categoria" in filtered.columns else 0
    taxa_cancelamento = (cancelados / total * 100) if total else 0
    media_limite = filtered["Limite"].mean() if "Limite" in filtered.columns else 0
    media_transacoes = filtered["Valor_Transacoes_12m"].mean() if "Valor_Transacoes_12m" in filtered.columns else 0

    kpi_total = [html.Div("Total de clientes"), html.H3(f"{total:,}")]
    kpi_cancelados = [html.Div("Cancelados"), html.H3(f"{cancelados:,}")]
    kpi_taxa = [html.Div("Taxa de cancelamento"), html.H3(f"{taxa_cancelamento:.1f}%")]
    kpi_limite = [html.Div("Limite medio"), html.H3(f"{media_limite:,.0f}")]
    kpi_transacoes = [html.Div("Valor transacoes 12m (medio)"), html.H3(f"{media_transacoes:,.0f}")]

    if "Sexo" in filtered.columns:
        df_rate = (
            filtered.assign(is_cancelado=filtered["Categoria"] == "Cancelado")
            .groupby("Sexo", dropna=False)["is_cancelado"]
            .mean()
            .reset_index()
        )
        fig_cancel_sexo = px.bar(df_rate, x="Sexo", y="is_cancelado", title="Taxa de cancelamento por sexo")
        fig_cancel_sexo.update_yaxes(tickformat=".0%")
    else:
        fig_cancel_sexo = px.bar(title="Taxa de cancelamento por sexo")

    if "Idade" in filtered.columns:
        fig_idade = px.histogram(filtered, x="Idade", nbins=20, title="Distribuicao de idade")
    else:
        fig_idade = px.histogram(title="Distribuicao de idade")

    if "Categoria_Cartao" in filtered.columns and "Limite" in filtered.columns:
        fig_limite_cartao = px.box(
            filtered,
            x="Categoria_Cartao",
            y="Limite",
            title="Limite por categoria de cartao",
        )
    else:
        fig_limite_cartao = px.box(title="Limite por categoria de cartao")

    if "Qtde_Transacoes_12m" in filtered.columns and "Valor_Transacoes_12m" in filtered.columns:
        fig_transacoes = px.scatter(
            filtered,
            x="Qtde_Transacoes_12m",
            y="Valor_Transacoes_12m",
            color="Categoria" if "Categoria" in filtered.columns else None,
            title="Quantidade x valor de transacoes (12m)",
        )
    else:
        fig_transacoes = px.scatter(title="Quantidade x valor de transacoes (12m)")

    return (
        kpi_total,
        kpi_cancelados,
        kpi_taxa,
        kpi_limite,
        kpi_transacoes,
        fig_cancel_sexo,
        fig_idade,
        fig_limite_cartao,
        fig_transacoes,
    )


if __name__ == "__main__":
    app.run(debug=True)
