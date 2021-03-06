# FCE / DIRECCTE national

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
- `bundle exec c42 install`
- Configurer pettier sur son IDE : https://prettier.io/docs/en/vim.html
- Configurer les tokens des APIs dans le fichier `server/.env` (LastPass: FCE tokens APIs)
- Ajouter la clé la clé "search-key" pour appsearch dans `server/.env` (https://appsearch.fce.test/as/engines/fce puis cliquez sur "Credentials")

## Contribution

### Gitflow

La numérotation des version de fait sur la base de : vAA.MM.JJ.P
- AA = année (ex : 19)
- MM = mois (ex : 04)
- JJ = jour de début de sprint
- P = patch (par defaut 0) à incrémenter pour chaque hotfix

A la fin d'une itération on ouvre une branche release qu'on ne mergera que quand l'ensemble des tickets sera validés. En cas de retours, on crée une branche issue de cette release (et non develop) qu'on enverra en PR par rapport à la branche release. Une fois validé on pourra mettre à jour develop par rapport à release.

Cela nous permettra de pouvoir commencer une itération suivante sans mettre à mal le déploiement de la précédente release.

### Nommage des commits

Les messages de commit doivent respecter la convention suivante : grafikart.fr/tutoriels/nommage-commit-1009

La librairie Commitizen permet de saisir facilement des messages de commit en respectant cette convention

Installation

```bash
yarn install
```

Effectuer un commit

```bash
yarn commit
```

Quelques rêgles propre au projet

- concernant le scope, il peut être découpé en 2 en fonction de la portée, l'idéal par exemple pour un commit sur le composant entreprise du client est de saisir `client:entreprise` dans le pire des cas mettre seulement la 1er partie ex : `server`

- quand on vous demande si il y a une issue associée, mettre l'url de la carte Trello. (ex : https://trello.com/c/lhyJhStb/78-changer-les-logos-dans-le-footer)


## Déploiement

### Requirements

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

### Procédure

( A automatiser via Jenkins )

#### Local

- cloner le repo sur sa machine en récupérant la branche master

- `.c42/scripts/install.sh`

- `.c42/scripts/build.sh`

- Dans le répertoire dist executer `yarn`

- `rsync -avz dist/ fce:production/releases/AAAAMMDDHHMM`

#### Serveur

- `cp production/shared/.env production/releases/AAAAMMDDHHMM/.env`

- `rm -rf production/current`

- `cp -R production/releases/AAAAMMDDHHMM production/current`

- dans `production/current` executer `docker-compose restart`

## Troubleshooting

- **Mes modifications dans frentreprise ne sont pas prise en compte**

Au changement de branche le lien entre `frentreprise` et le `server` peuvent se casser, redémarrer le container `frentreprise` devrait régler le problème.

Une manière de voir facilement si le lien est bon est d'écouter le container `server` et de faire une modification sur `frentreprise`, s'il redémarre c'est que tout fonctionne.

## Tests

### Client

Les tests de la partie client ont été réalisé avec [Cypress](https://www.cypress.io/)

Pour les executer il vous faudra dans un premier temps l'installer :

```shell
# se placer dans le dossier client "cd client"
./node_modules/.bin/cypress install
```

Vous pourrez ensuite lancer l'interface GUI via la commande (vous pouvez utiliser un autre port si celui-ci est déjà utilisé sur votre machine)

**Pour fonctionner les containers `front`, `mongo` et `server` doivent être démarré**

```shell
# se placer dans le dossier client "cd client"
./node_modules/.bin/cypress open --port 8080 --env host=http://direccte.test
```

### Server

```shell
.c42 server:npm test
```

## Import csv dans postgres

### shell

```shell
NODE_ENV=production node ./shell/run.js ImportCsv monfichier.csv
```

### psql

```shell
psql -d commit42_fce -U commit42_fce  -c "\copy etablissements_uc_eff(siret, cod_section, nme_ddtefp3, nme_region, dereffphy, date_effphy_et, source_effphy_et) FROM '/tmp/import/etablissements_uc_eff.csv' with (format csv, header true, delimiter ',');"
```

## Postgres

### Générer un dump de la preprod pour mettre à jour la production

```bash
pg_dump commit42_fce -U commit42_fce --exclude-table=categorie_juridique --exclude-table=communes --exclude-table=departements --exclude-table=entreprises --exclude-table=etablissements --exclude-table=magic_links --exclude-table=naf --clean | gzip > dump.sql.gz
```

### Full text

- https://bersace.cae.li/fts-recherche-plein-texte-postgres.html
- https://bersace.cae.li/fts-postgres-insert.html

Créer le champ de recherche fulltext unique pour les établissements :

```sql
ALTER TABLE etablissements ADD COLUMN search_vector tsvector;

UPDATE etablissements AS etab
SET search_vector =
	setweight(to_tsvector(coalesce(ent.denominationunitelegale,'')), 'A')    ||
	setweight(to_tsvector(coalesce(ent.nomunitelegale,'')), 'A')  ||
    setweight(to_tsvector(coalesce(ent.nomusageunitelegale,'')), 'A') ||
    setweight(to_tsvector(coalesce(etab.enseigne1etablissement,'')), 'A') ||
    setweight(to_tsvector(coalesce(etab.siren,'')), 'A') ||
    setweight(to_tsvector(coalesce(etab.siret,'')), 'A')
FROM entreprises as ent
WHERE ent.siren = etab.siren;

CREATE INDEX search_vector_idx ON etablissements USING GIST (search_vector);
```
