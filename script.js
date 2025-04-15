'use strict'

const userNumber = '11987876567' 

async function carregarContatosApi() {
  try {
    const url = `http://localhost:8080/v1/whatsapp/contatos/${userNumber}`
    const response = await fetch(url)
    const data = await response.json()

    return data
  } catch (error) {
    console.error('Erro ao carregar contatos:', error)
  }
}

async function carregarDadosConversasApi(contactName) {
  try {
    const url = `http://localhost:8080/v1/whatsapp/conversas?numero=${userNumber}&contato=${encodeURIComponent(contactName)}`
    const response = await fetch(url)
    const data = await response.json()

    return data
  } catch (error) {
    console.error('Erro ao carregar conversa:', error)
  }
}

async function abrirConversa(nome){
  const dadosMensagens = await carregarDadosConversasApi(nome)

  // Verifica se o caminho existe e tem mensagens
  if (
    !dadosMensagens ||
    !Array.isArray(dadosMensagens.conversas) ||
    dadosMensagens.conversas.length === 0 ||
    !Array.isArray(dadosMensagens.conversas[0].conversas)
  ) {
    console.error('Erro: estrutura inesperada em dadosMensagens:', dadosMensagens)
    return
  }

  const mensagens = dadosMensagens.conversas[0].conversas

  const containerConversa = document.getElementById('containerConversa')
  containerConversa.replaceChildren()

  mensagens.forEach(function(itemConversas){
    const isUsuario = itemConversas.sender == "me"

    const containerInvisivel = document.createElement('div')
    containerInvisivel.classList.add(isUsuario ? 'containerInvisivelUsuario' : 'containerInvisivel')

    const conversa = document.createElement('div')
    conversa.classList.add(isUsuario ? 'conversaPropia' : 'conversaContato')

    const h1 = document.createElement('h1')
    const pHorario = document.createElement('p')
    const pTexto = document.createElement('p')

    h1.textContent = itemConversas.sender
    pHorario.textContent = itemConversas.time
    pTexto.textContent = itemConversas.content

    conversa.appendChild(h1)
    conversa.appendChild(pHorario)
    conversa.appendChild(pTexto)

    containerInvisivel.appendChild(conversa)
    containerConversa.appendChild(containerInvisivel)
  })
}


async function criarLiDeContatos() {
  const dados = await carregarContatosApi()
  const dadosContatos = dados?.dados_pessoais || []

  const ul = document.getElementById('ulContatos')
  ul.innerHTML = ''

  dadosContatos.forEach(function (item) {
    const liContato = document.createElement('li')
    liContato.classList.add('contato')

    liContato.addEventListener('click', () => {
      console.log('Clicou no contato:', item.name)
      abrirConversa(item.name)
    })

    const divImage = document.createElement('div')
    divImage.classList.add('imagemContato')

    const divTextosCont = document.createElement('div')
    divTextosCont.classList.add('textosContainers')

    const h1ListaContato = document.createElement('h1')
    const pListaContato = document.createElement('p')

    h1ListaContato.textContent = item.name
    pListaContato.textContent = item.descricao

    liContato.appendChild(divImage)
    divTextosCont.appendChild(h1ListaContato)
    divTextosCont.appendChild(pListaContato)
    liContato.appendChild(divTextosCont)

    ul.appendChild(liContato)
  })
}

criarLiDeContatos()

// Função para enviar mensagem falsa no chat (apenas visual)
document.querySelector('.input-area button').addEventListener('click', () => {
  const input = document.querySelector('.input-area input')
  const texto = input.value.trim()
  if (!texto) return

  const containerConversa = document.getElementById('chatBox')
  const div = document.createElement('div')
  div.classList.add('containerInvisivelUsuario')
  div.textContent = texto
  containerConversa.appendChild(div)

  input.value = ''
  containerConversa.scrollTop = containerConversa.scrollHeight
})
