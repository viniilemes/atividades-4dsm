# Dashboard Clientes Banco

> Dashboard em Plotly Dash que consome o arquivo `ClientesBanco.csv` e exibe KPIs e gráficos interativos.

## Estrutura
- `src/app.py` - aplicação Dash principal
- `ClientesBanco.csv` - dados (já presente na raiz)
- `requirements.txt` - dependências (nota: use Conda no Windows para evitar problemas de build)

## Requisitos recomendados
- Windows 10/11
- Miniconda (recomendado) ou Python 3.11+ com `venv`

## Instalação (recomendado: Conda)
1. Instale Miniconda: https://docs.conda.io/en/latest/miniconda.html (ou via `winget`)
2. Crie e ative o ambiente:

```powershell
conda create -n dashenv python=3.11 -y
conda activate dashenv
```

3. Instale dependências (conda-forge - binários pré-compilados):

```powershell
conda install -n dashenv -c conda-forge pandas=2.2.2 plotly dash -y
```

4. Execute a aplicação:

```powershell
conda run -n dashenv python src/app.py
# ou, se o env estiver ativado:
python src/app.py
```

Abra no navegador: http://127.0.0.1:8050

## Alternativa (sem conda)
1. Instale Python 3.11 do python.org
2. Crie um `venv` e instale dependências:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
python src/app.py
```

> Observação: com Python 3.14 o `pip install pandas` pode falhar pois não existem wheels oficiais para todas as plataformas; por isso usamos Conda/Python 3.11.

## CSV e colunas
O app espera encontrar o arquivo `ClientesBanco.csv` na raiz do projeto. O `src/app.py` normaliza nomes de colunas e converte colunas numéricas automaticamente.

## Solução rápida de problemas
- Erro ao instalar `pandas` via pip no Windows: use Conda (passo recomendado) ou instale o Build Tools do Visual Studio (compilação local, mais complexa).
- Se o app não aparecer: verifique firewall/porta e logs no terminal onde executou `python src/app.py`.

## Próximos passos
- Adicionar gráficos adicionais (por faixa salarial, educação, estado civil)
- Gerar `environment.yml` para reproduzibilidade

Se quiser, eu crio o `environment.yml` e um `README` em versão reduzida para deploy no Render/Heroku.
