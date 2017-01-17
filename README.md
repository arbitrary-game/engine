# Arbitrary Game

## Prerequisite Requirements
1. Add to /etc/sudoers: ubuntu	ALL=(ALL) NOPASSWD: ALL 
2. Generate RSA Key: ssh-keygen
3. Add SSH Key to Authorized List: cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
4. Install Git Client: sudo apt-get install git
5. Install Meteor: curl https://install.meteor.com/ | sh
6. Install NVM: curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
7. Install Node: nvm install node
8. Install NPM Packages: npm install -g json mup stripe
9. Download Dropbox: cd ~ && wget -O - "https://www.dropbox.com/download?plat=lnx.x86_64" | tar xzf -
10. Execute Dropbox to Sync Config Files: ~/.dropbox-dist/dropboxd
11. Copy Dropbox Config Files: sudo cp ~/Dropbox /opt/ && sudo chown -R ubuntu:ubuntu /opt/Dropbox/

## Deployment procedure

Clone the Repo
```
mkdir /opt/and
cd /opt/and/
sudo chown -R ubuntu:ubuntu /opt/and
git clone REPO_URL
```
Clonse Submodules:
```
git submodule update --init --recursive
```

Configure ssh-agent if necessary (we use RSA key to access to the server) 
```
eval $(ssh-agent)
ssh-add
Enter the passphase new if you RSA key is encrypted...
```

Use Mup to Configure the Server
```
cd mup/prod
mup setup
```

Ensure required modules are installed
```
meteor npm install
```

Call deployment script
```
./bin/deploy prod
```
