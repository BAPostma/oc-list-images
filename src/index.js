#!/usr/bin/env node

const openshiftRestClient = require('openshift-rest-client');
const chalk = require('chalk');

const arguments = process.argv.slice(2);

const osConfig = {
    request: {
        strictSSL: false
    }
};

openshiftRestClient(osConfig).then(async osClient => {
    let model = { 
        projects: []
    };
    
    let rawProjects = await osClient.projects.findAll();
    rawProjects.items.map(project => {
        model.projects.push({
            id: project.metadata.uid,
            name: project.metadata.annotations['openshift.io/display-name'],
            namespace: project.metadata.name,
            pods: []
        });
    });

    console.log(`Connected to ${chalk.white(`OpenShift`)} environment ${chalk.underline.blue(osClient.apiUrl)}`);
    console.log(chalk.green(`Enumerating projects (found ${model.projects.length})`));
    
    let rawPods = await osClient.pods.findAll();
    await model.projects.map(async project => {
        let pods = await rawPods.items.filter(pod => pod.metadata.namespace == project.namespace);
        if(!pods || pods.length === 0) {
            console.log(chalk.red(`No pods discovered for ${chalk.white(project.namespace)} (do you have access?)`));
            return;
        }

        console.log(chalk.green(`Enumerating ${pods.length} pods for ${chalk.white(project.namespace)}`))
        pods.forEach(pod => {
            project.pods = {
                uid: pod.metadata.uid,
                name: pod.metadata.name,
                labels: pod.metadata.labels,
                containers: pod.spec.containers.map(container => {
                    return {
                        name: container.name,
                        image: container.image
                    }
                })
            };

            console.log(`   └ ${pod.metadata.name}`);
            pod.spec.containers.forEach(container => {
                console.log(`       └ ${container.name}: ${chalk.yellow(container.image)}`);
            })
        });
    });

    if(/json/i.test(arguments[0])) {
        console.log(JSON.stringify(model));
    }
});