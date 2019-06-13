cask 'menutube' do
  version :latest
  sha256 :no_check

  # github.com/edanchenkov/MenuTube was verified as official when first introduced to the cask
  url "https://github.com/edanchenkov/MenuTube/releases/download/#{version}/MenuTube.#{version}.zip"
  appcast 'https://github.com/edanchenkov/MenuTube/releases.atom'
  name 'MenuTube'
  homepage 'https://edanchenkov.github.io/MenuTube/'

  app 'MenuTube.app'
end
