from setuptools import setup, find_packages

def get_requirements(filename):
    """Get requirements from a file"""
    with open(filename) as f:
        requirements = f.read().splitlines()
        requirements = [r for r in requirements if not r.startswith('#') if not r.startswith('-')]
        return requirements

setup(
    name='StudentExamPerformancePrediction',
    version='0.0.1',
    author='Anshul Gupta',
    author_email='anshulgupta711@gmail.com',
    packages=find_packages(),
    install_requires=get_requirements('requirements.txt'),
)