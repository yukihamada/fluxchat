import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home', () => {
  it('renders the FluxChat title', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: /fluxchat/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the unified inbox', () => {
    render(<Home />)
    const inboxHeading = screen.getByText('統合インボックス')
    expect(inboxHeading).toBeInTheDocument()
  })

  it('renders sample messages', () => {
    render(<Home />)
    const sampleMessage = screen.getByText('Sample Message')
    expect(sampleMessage).toBeInTheDocument()
  })
})