from setuptools import setup, find_packages, Command
import os

with open("requirements.txt") as req:
    requirements=req.readlines()

class CleanCommand(Command):
    """Custom clean command to tidy up the project root."""
    user_options = []
    def initialize_options(self):
        pass
    def finalize_options(self):
        pass
    def run(self):
        os.system('rm -vrf ./build ./dist ./*.pyc ./*.tgz ./*.egg-info')


with open("README.md","r") as readme:
    long_description=readme.read()

setup(
    name="MirMachine",
    version="0.1.2",
    packages=find_packages(),
    scripts=["mirmachine/mirmachine.py"],
    long_description=long_description,
    long_description_content_type="text/markdown",
    extras_require={"dev":["pytest>=3.7"]},
    #install_requires=requirements,
    include_package_data=True,
    zip_safe=False,
    #data_files={"meta":["*.tsv"]},
    #data_files=[("meta",["*.CM"])],
    # metadata to display on PyPI
    author="Sinan U. Umu",
    author_email="sinanugur@gmail.com",
    description="MirMachine",
    keywords="RNA miRNA detection prediction",
        cmdclass={
        'clean': CleanCommand,
    },
    url="https://github.com/sinanugur/MirMachine",   # project home page, if any
    classifiers=[
        "License :: OSI Approved :: Python Software Foundation License"
    ]

    # could also include long_description, download_url, etc.
)
