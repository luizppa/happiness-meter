let departments = [
  'Selecionar',
  'Central de Reservas',
  'Central de Relacionamento',
  'TVC',
  'RM',
  'Marketing',
  'Comercial',
  'Eventos Interno',
  'Financeiro',
  'Contabilidade',
  'RH',
  'Departamento Pessoal'
]
let step = 1
let form_data = {
  briefing: '',
  department: 'Selecionar',
  rate: null,
  justification: ''
}

window.onload = () => {
  load_step_one(false)
}

window.onresize = () => {
  adjust_sizes()
}


let adjust_sizes = () => {
  let form = document.getElementById('form')
  let form_area = document.getElementById('form-area')
  let margin = (((form_area.clientHeight-form.clientHeight)/2)-53)+'px'
  form.style.marginTop = margin
}

let load_departments = () => {
  let select_element = document.getElementById('department')
  departments.forEach(department => {
    let option = document.createElement('option')
    option.value = department
    option.innerText = department
    option.disabled = department == 'Selecionar'
    select_element.appendChild(option)
  })
  select_element.value = form_data.department
}

let clear_form_element = () => {
  let form = document.getElementById('form')
  let first = form.firstElementChild
  while (first) {
      first.remove()
      first = form.firstElementChild
  }
}

let fade_form_out = () => {
  let form = document.getElementById('form')
  let form_end = document.getElementById('form-end')
  form.className = 'row justify-content-center fading-out'
  form_end.className = 'row fading-out'
  setTimeout(() => {
    form.className = 'row justify-content-center'
    form_end.className = 'row'
  }, 800)
}

let fade_form_in = () => {
  let form = document.getElementById('form')
  let form_end = document.getElementById('form-end')
  form.className = 'row justify-content-center fading-in'
  form_end.className = 'row fading-in'
  setTimeout(() => {
    form.className = 'row justify-content-center'
    form_end.className = 'row'
  }, 800)
}

let disable_previous = () => {
  let button = document.getElementById('previous-button')
  button.disabled = true
}

let enable_previous = () => {
  let button = document.getElementById('previous-button')
  button.disabled = false
}

let disable_next = () => {
  let button = document.getElementById('next-button')
  button.disabled = true
}

let enable_next = () => {
  let button = document.getElementById('next-button')
  button.disabled = false
}

let set_button_text = (text) => {
  let button = document.getElementById('next-button')
  button.innerText = text
}

let next = () =>{
  switch(step){
    case 1:
      read_step_one()
      load_step_two()
      step = 2
      break
    case 2:
      load_step_three()
      step = 3
      break
    case 3:
      read_step_three()
      send()
      break
  }
}

let previous = () =>{
  switch(step){
    case 2:
      load_step_one()
      step = 1
      break
    case 3:
      read_step_three()
      load_step_two()
      step = 2
      break
  }
}

let read_step_one = () => {
  let department_input = document.getElementById('department')
  let briefing_input = document.getElementById('briefing')
  form_data.department = department_input.value
  form_data.briefing = briefing_input.value
}

let read_step_three = () => {
  let justification_textarea = document.getElementById('justification')
  form_data.justification = justification_textarea.value
}

let load_step_one = (fade = true) => {
  form_transition_animation(() => {
    disable_previous()
    if(form_data.department == 'Selecionar' || form_data.briefing == '') disable_next()
    else enable_next()
    let form = document.getElementById('form')
    let briefing_col = get_col(12, 12, 12, 12)
    let briefing_input = get_textarea('briefing', form_data.briefing, 3)
    let briefing_label = get_label('briefing', 'Para você, o que é ser feliz no trabalho?*')
    briefing_col.id = 'briefing-col'
    briefing_col.appendChild(briefing_label)
    briefing_col.appendChild(briefing_input)
    briefing_input.oninput = () => {
      check_enable()
    }
    let department_col = get_col(12, 12, 6, 6)
    let department_select = get_select('department', form_data.department)
    let department_label = get_label('department', 'Departamento*')
    department_col.appendChild(department_label)
    department_col.appendChild(department_select)
    form.appendChild(department_col)
    form.appendChild(briefing_col)
    load_departments()
  }, fade)
}

let load_step_two = () => {
  form_transition_animation(() => {
    set_button_text('Próximo')
    enable_previous()
    if(form_data.rate == null) disable_next()
    load_vote_buttons()
  })
}

let load_step_three = () => {
  form_transition_animation(() => {
    set_button_text('Enviar')
    let form = document.getElementById('form')
    let justification_col = get_col(12, 12, 12, 12)
    let justification_textarea = get_textarea('justification', form_data.justification)
    let justification_text = 'Justificativa'
    if(form_data.rate > 3){
      justification_text = 'O que te deixa feliz trabalhando conosco?*'
    }
    else{
      justification_text = 'O que falta para que você se sinta feliz trabalhando conosco?*'
    }
    let justification_label = get_label('justification', justification_text)
    justification_col.appendChild(justification_label)
    justification_col.appendChild(justification_textarea)
    form.appendChild(justification_col)
  })
}

let finish = () => {
  form_data = {
    briefing: '',
    department: 'Selecionar',
    rate: null,
    justification: ''
  }
  form_transition_animation(() => {
    disable_next()
    disable_previous()
    let form_element = document.getElementById('form')
    let header_col = get_col(12, 12, 12, 12)
    let message_col = get_col(12, 12, 12, 12)
    let header = document.createElement('h3')
    let message = document.createElement('p')
    header.innerText = 'Avaliação enviada'
    message.innerText = 'Obrigado pelo seu feedback, dessa forma poderemos criar um ambiente mais agradável e produtivo.'
    header.style.textAlign = 'center'
    message.style.textAlign = 'center'
    header_col.appendChild(header)
    message_col.appendChild(message)
    form_element.appendChild(header_col)
    form_element.appendChild(message_col)
  })
}

let vote_satisfaction = (rate) => {
  form_data.rate = rate
  clear_form_element()
  enable_next()
  load_vote_buttons()
}

let check_enable = () => {
  let department_input = document.getElementById('department')
  let briefing_input = document.getElementById('briefing')
  if(briefing_input == null || department_input == null){
    disable_next()
  }
  else{
    if(department_input.value != 'Selecionar' && briefing_input.value != '') enable_next()
    else disable_next()
  }
}

let send = () => {
  disable_next()
  disable_previous()
  let xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      finish()
    }
    if(xhttp.readyState == 4 && xhttp.status != 200){
      enable_next()
      enable_previous()
    }
  }
  xhttp.open("POST", "https://us-central1-hapiness-meter.cloudfunctions.net/post_rate", true)
  form_data['datetime'] = new Date().toLocaleString()
  xhttp.send(JSON.stringify(form_data))
}

let get_col = (xs_size, sm_size, md_size, lg_size) => {
  let col = document.createElement('div')
  col.className = `col-${xs_size} col-sm-${sm_size} col-md-${md_size} col-lg-${lg_size}`
  return col
}

let get_input = (name, value) => {
  let input = document.createElement('input')
  input.id = name
  input.name = name
  input.type = 'text'
  input.value = value
  return input
}

let get_select = (name, value) => {
  let select = document.createElement('select')
  select.id = name
  select.name = name
  select.value = value
  select.onchange = () => {
    check_enable()
  }
  return select
}

let get_textarea = (name, value, rows) => {
  let textarea = document.createElement('textarea')
  textarea.id = name
  textarea.name = name
  textarea.value = value
  textarea.rows = rows
  return textarea
}

let get_vote_button = (type, icon, vote) => {
  let button = document.createElement('i')
  button.id = type
  if (vote == form_data.rate) {
    button.className = `satisfaction-icon active far fa-${icon}`
  }
  else{
    button.className = `satisfaction-icon far fa-${icon}`
  }
  button.onclick = () => {
    vote_satisfaction(vote)
  }
  return button
}

let get_label = (label_for, text) => {
  let label = document.createElement('label')
  label.for = label_for
  label.innerText = text
  return label
}

let load_vote_buttons = () => {
  let form = document.getElementById('form')
  let label_col = get_col(12, 12, 12, 12)
  let label = document.createElement('h4')
  label.innerText = 'Qual é seu nível de satisfação atual no trabalho?*'
  label_col.appendChild(label)
  let very_happy_button = get_vote_button('very-happy', 'grin', 5)
  let happy_button = get_vote_button('happy', 'smile', 4)
  let neutral_button = get_vote_button('neutral', 'meh', 3)
  let sad_button = get_vote_button('sad', 'frown', 2)
  let very_sad_button = get_vote_button('very-sad', 'sad-tear', 1)
  form.appendChild(label_col)
  form.appendChild(very_sad_button)
  form.appendChild(sad_button)
  form.appendChild(neutral_button)
  form.appendChild(happy_button)
  form.appendChild(very_happy_button)
}

let form_transition_animation = (callback, fade = true) => {
  if(fade) fade_form_out()
  setTimeout(() => {
    clear_form_element()
    callback()
    adjust_sizes()
    fade_form_in()
  }, fade ? 800 : 0)
}
