import { getAddressByCEP, getEstados, getCidadesByEstado } from '../../shared/utils/externalApis.js';
import { logAction, logError } from '../../shared/utils/logger.js';

export async function searchCEP(req, res) {
  try {
    const { cep } = req.body;

    if (!cep) {
      return res.status(400).json({ error: 'CEP é obrigatório' });
    }

    const addressData = await getAddressByCEP(cep);

    logAction('SEARCH_CEP', { cep });
    return res.json(addressData);
  } catch (error) {
    logError('SEARCH_CEP_FAILED', error);
    return res.status(400).json({ error: error.message });
  }
}

export async function listEstados(req, res) {
  try {
    const estados = await getEstados();

    logAction('LIST_ESTADOS', { count: estados.length });
    return res.json(estados);
  } catch (error) {
    logError('LIST_ESTADOS_FAILED', error);
    return res.status(500).json({ error: error.message });
  }
}

export async function listCidades(req, res) {
  try {
    const { estadoId } = req.params;

    if (!estadoId) {
      return res.status(400).json({ error: 'Estado ID é obrigatório' });
    }

    const cidades = await getCidadesByEstado(estadoId);

    logAction('LIST_CIDADES', { estadoId, count: cidades.length });
    return res.json(cidades);
  } catch (error) {
    logError('LIST_CIDADES_FAILED', error);
    return res.status(500).json({ error: error.message });
  }
}
