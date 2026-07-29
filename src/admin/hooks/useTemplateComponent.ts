import { TemplateProps } from "../templates/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getTemplate } from "../templates/registry";
import React from "react";

export const useTemplateComponent = (
  templateId: "clean" | "classic" | "compact",
  props: TemplateProps,
): UseQueryResult<React.ReactElement, Error> => {
  return useQuery<React.ReactElement, Error>({
    queryKey: ["invoices-plugin-template-component", templateId, JSON.stringify(props)],
    queryFn: async () => {
      const template = getTemplate(templateId);

      return template.render(props);
    },
  });
};
