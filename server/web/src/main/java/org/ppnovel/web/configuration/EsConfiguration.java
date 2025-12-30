package org.ppnovel.web.configuration;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.rest_client.RestClientTransport;

@Configuration
public class EsConfiguration {
    @Value("${elasticsearch.host}")
    private String host;

    @Value("${elasticsearch.port}")
    private int port;


    @Bean
    public ElasticsearchClient elasticsearchClient() {
       RestClient restClient = RestClient.builder(
        new HttpHost(host, port, "http")
       ).build();

       RestClientTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());
       return new ElasticsearchClient(transport);
    }
}
