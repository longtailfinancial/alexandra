/*
    This is an admin-only command that needs three things:

        A Github access token,
        get one here: https://github.com/settings/tokens/new?scopes=repo

        A Github organization name, 
        you can acquire it from your organization's URL.
        ex: http://github.com/some_organization

        Admin list, admin.txt

*/


const access_token = "";
const org_name="";

async function grab_list () {
    

    const response = await octokit.request('GET /orgs/{org}/repos', {
        org: org_name,
        per_page: 100,
        
    })
    
    return response;
}


module.exports = {
	name: 'lrepos',
	description: 'List all repos within a Github organization',
	execute(message, args) {

        if(!access_token.length) {
            console.error("No access token.")
            return;
        }

        if(!org_name.length) {
            console.error("No org name.")
            return;
        }

        let call_result;

        grab_list().then(x => {

            call_result = x;
            console.log(call_result.data);
            call_result.data.forEach(element => {
                console.log(element.name);
            });

        });


	},
};
