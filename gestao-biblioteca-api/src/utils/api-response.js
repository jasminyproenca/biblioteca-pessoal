'use strict';

/**
 * Utilitário para padronizar todas as respostas da API.
 *
 * Formato de sucesso:
 * { success: true, message: '...', data: {} }
 *
 * Formato de erro:
 * { success: false, message: '...', error: { code: '...', details: [] } }
 */

/**
 * Envia uma resposta de sucesso.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number}  options.statusCode - HTTP status code (padrão: 200)
 * @param {string}  options.message    - Mensagem descritiva
 * @param {*}       options.data       - Dados retornados
 */
function success(res, { statusCode = 200, message = 'Operação realizada com sucesso', data = null } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Envia uma resposta de erro.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number}   options.statusCode - HTTP status code (padrão: 500)
 * @param {string}   options.message    - Descrição do erro
 * @param {string}   options.code       - Código interno do erro (snake_upper_case)
 * @param {Array}    options.details    - Detalhes adicionais (ex: campos inválidos)
 */
function error(res, { statusCode = 500, message = 'Erro interno do servidor', code = 'INTERNAL_ERROR', details = [] } = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details,
    },
  });
}

module.exports = { success, error };
