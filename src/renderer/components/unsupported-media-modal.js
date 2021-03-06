const React = require('react')
const electron = require('electron')
const path = require('path')

const {dispatcher} = require('../lib/dispatcher')

module.exports = class UnsupportedMediaModal extends React.Component {
  render () {
    const state = this.props.state
    const err = state.modal.error
    const message = (err && err.getMessage)
      ? err.getMessage()
      : err
    const playerPath = state.saved.prefs.externalPlayerPath
    const playerName = playerPath
      ? path.basename(playerPath).split('.')[0]
      : 'VLC'
    const onPlay = dispatcher('openExternalPlayer')
    const actionButton = state.modal.externalPlayerInstalled
      ? (<button className='button-raised' onClick={onPlay}>Play in {playerName}</button>)
      : (<button className='button-raised' onClick={() => this.onInstall()}>Install VLC</button>)
    const playerMessage = state.modal.externalPlayerNotFound
      ? 'Couldn\'t run external player. Please make sure it\'s installed.'
      : ''
    return (
      <div>
        <p><strong>Sorry, we can't play that file.</strong></p>
        <p>{message}</p>
        <p className='float-right'>
          <button className='button-flat' onClick={dispatcher('backToList')}>Cancel</button>
          {actionButton}
        </p>
        <p className='error-text'>{playerMessage}</p>
      </div>
    )
  }

  onInstall () {
    electron.shell.openExternal('http://www.videolan.org/vlc/')

    // TODO: dcposch send a dispatch rather than modifying state directly
    const state = this.props.state
    state.modal.externalPlayerInstalled = true // Assume they'll install it successfully
  }
}
