FROM ubuntu:20.04
USER root
RUN apt-get update && apt-get install -y \
    git \
    curl \
    python3-pip
RUN pip3 install Cython && \
    pip3 install numpy==1.19.5 && \
    pip3 install pydantic==1.7.4 && \
    pip3 install scikit-learn==0.21.3 && \
    pip3 install jupyterlab==2.2.9 && \
    pip3 install poetry && \
    pip3 install psutil && \
    pip3 install boto3 && \
    pip3 install networkx && \
    pip3 install altair
RUN curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt install -y nodejs
RUN git clone https://github.com/zitryss/jupyterpads.git && \
    cd jupyterpads && \
    jlpm && \
    jlpm build && \
    jupyter labextension install && \
    jupyter lab build
RUN git clone -b feature/created_at https://github.com/zitryss/pypads.git && \
    cd pypads && \
    poetry build && \
    pip3 install ./dist/pypads-0.5.7.tar.gz
RUN git clone -b feature/roc_curve https://github.com/zitryss/pypads-padre.git && \
    cd pypads-padre && \
    poetry build && \
    pip3 install ./dist/pypads-padre-0.4.3.tar.gz
ENTRYPOINT ["jupyter", "lab"]


#    pip3 install pypads_padre && \

#    git clone https://github.com/zitryss/jupyterpads.git && \
#    cd jupyterpads && \
#    jlpm && \
#    jlpm build && \
#    jupyter labextension install && \
#    jupyter lab build


#FROM jupyter/base-notebook:lab-2.2.9
#ENV JUPYTER_ENABLE_LAB=yes GRANT_SUDO=yes
#USER root
#RUN apt-get update && \
#    apt-get install -y git && \
#    conda install python=3.7 && \
#    pip3 install pypads && \
#    pip3 install pypads_padre && \
#    pip3 install numpy==1.19 && \
#    pip3 install Cython && \
##    sudo /opt/conda/bin/conda install -c conda-forge scikit-learn && \
#    sudo /opt/conda/bin/conda install -c conda-forge scikit-learn==0.21.3 && \
#    git clone https://github.com/zitryss/jupyterpads.git && \
#    cd jupyterpads && \
#    jlpm && \
#    jlpm build && \
#    jupyter labextension install && \
#    jupyter lab build

# docker run -p 8888:8888 jup22
# docker build -t jup22 .
# sqad1fut_LUSM0jeeh