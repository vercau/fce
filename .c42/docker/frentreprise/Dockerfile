FROM node:10.14

RUN mkdir -p /root/.ssh
RUN ssh-keyscan -H github.com >> /root/.ssh/known_hosts

ENV SSH_AUTH_SOCK=/ssh-agent

WORKDIR /project
VOLUME ["/project"]

RUN yarn install

CMD ["yarn", "start"]

COPY "run.sh" "/run.sh"
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
