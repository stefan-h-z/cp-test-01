interface ParameterDefinition {
  name: string;
  type: string;
}

export abstract class AbstractOperator {
  protected parameterDefinitions: Array<ParameterDefinition> = [];
  public abstract execute(): unknown;
}
