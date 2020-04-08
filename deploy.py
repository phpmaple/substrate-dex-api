from fabric import Connection


def main():
    c = Connection("ubuntu@152.32.226.93")
    with c.cd('/home/ubuntu/projects/substrate-dex-api'):
        c.run('git pull')
        c.run('/usr/bin/yarn stop')
        c.run('/usr/bin/yarn start')


if __name__ == '__main__':
    main()
