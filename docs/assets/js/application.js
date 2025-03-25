import ClipboardJS from 'clipboard'

(function () {
  const btnHtml = [
  '<div class="bd-clipboard">',
    '<button type="button" class="btn-clipboard" title="Copy to clipboard">',
      '<i class="strib-icon strib-copy" aria-hidden="true"></i>',
    '</button>',
  '</div>'].join('')

  document.querySelectorAll('div.highlight')
    .forEach(element => {
      element.insertAdjacentHTML('beforebegin', btnHtml)
    })

  const clipboard = new ClipboardJS('.btn-clipboard', {
    target(trigger) {
      return trigger.parentNode.nextElementSibling
    }
  })

  clipboard.on('success', event => {
    const icon = event.trigger.querySelector( '.strib-icon')
    const originalTitle = event.trigger.title

    event.clearSelection()
    icon.classList.replace('strib-copy', 'strib-check')
    event.trigger.title = 'Copied!'

    setTimeout(() => {
      icon.classList.replace('strib-check', 'strib-copy')
      event.trigger.title = originalTitle
    }, 2000)
  })

  clipboard.on('error', () => {
    const modifierKey = /mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
    const fallbackMsg = `Press ${modifierKey}C to copy`
    const errorElement = document.getElementById('copy-error-callout')

    if (!errorElement) {
      return
    }

    errorElement.classList.remove('d-none')
    errorElement.insertAdjacentHTML('afterbegin', fallbackMsg)
  })

  const searchInput = document.getElementById('search')
  if (searchInput) {
    searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault()
      }
    })
  }

  // Disable empty links in docs
  document.querySelectorAll('[href="#"]')
    .forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault()
      })
    })
})()
