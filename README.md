# DIRECCTE

## Prérequis
Le projet nécessite d'avoir un ssh agent. Vérifiez si la commande suivante renvoie un chemin :
`echo $SSH_AUTH_SOCK`

Si ce n'est pas le cas, il faut mettre en place un ssh-agent sur votre shell.
Voici une procédure rapide utilisant [ssh-find-agent](https://github.com/wwalker/ssh-find-agent):

`sudo curl -o /etc/profile.d/ssh-find-agent.sh https://raw.githubusercontent.com/wwalker/ssh-find-agent/master/ssh-find-agent.sh`

`sudo chmod a+x /etc/profile.d/ssh-find-agent.sh`

`echo "ssh-find-agent -a || eval \$(ssh-agent) > /dev/null" >> ~/.bashrc`

ou, si vous utilisez zsh :

`echo "ssh-find-agent -a || eval \$(ssh-agent) > /dev/null" >> ~/.zshrc`


## Installation (projet)

- Installez Bundler si nécessaire : `sudo gem install bundler`
- Sinon Assurez-vous que qu'il est à jour `sudo gem update bundler`
- Installer le bundle : `bundle` ou `bundle install` à la racine du projet
- `c42 install`
- Configurer pettier sur son IDE : https://prettier.io/docs/en/vim.html


## Déploiement

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo apt-key fingerprint 0EBFCD88

sudo add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"

sudo apt-get update
sudo apt-get install docker-ce
```