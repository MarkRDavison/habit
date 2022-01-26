import argparse
import requests
import sys

class Arguments:
    def __init__(self):
        self.branch = None
        self.imagename = None
        self.imagetag = None
        self.crusername = None
    def __init__(self, branch, imagename, imagetag, crusername):
        self.branch = branch
        self.imagename = imagename
        self.imagetag = imagetag
        self.crusername = crusername

def doesTagExist(arguments, pageNumber):
    imagetagurl = 'https://hub.docker.com/v2/repositories/{CR_USERNAME}/{IMAGE_NAME}/tags?page={PAGE_NUMBER}'.format(
        CR_USERNAME=arguments.crusername,
        IMAGE_NAME=arguments.imagename,
        PAGE_NUMBER=pageNumber
    )

    responseData = requests.get(imagetagurl).json()
    next = responseData['next']
    results = responseData['results']

    for result in results:
        active = result['tag_status']
        if active != 'active':
            continue
        name = result['name']
        if name == arguments.imagetag:
            return True

    if next:
        return doesTagExist(arguments, pageNumber+1)

    return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=
'''
Determines if a given tag is present for an image
''')

    parser.add_argument('--branch', help='The name of the branch', required=True)
    parser.add_argument('--imagetag', help='The tag for the image', required=True)
    parser.add_argument('--imagename', help='The name of the container image to be created', required=True)
    parser.add_argument('--crusername', help='The username for the container registry', required=True)

    args = parser.parse_args()

    arguments = Arguments(
        branch=args.branch,
        imagename=args.imagename,
        imagetag=args.imagetag,
        crusername=args.crusername
    )

    if arguments.branch == 'main':
        sys.stdout.write('latest')
        exit(0)

    exists = doesTagExist(arguments, 1)
    if not exists:
        sys.stdout.write(arguments.imagetag)
    exit(0)